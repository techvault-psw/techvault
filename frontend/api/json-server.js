import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    
    req.on('error', reject);
  });
}

function deleteCascade(data, resource, itemId) {
  const deletedItems = {
    [resource]: [itemId]
  };
  
  const foreignKey = resource.endsWith('s') 
    ? resource.slice(0, -1) + 'Id' 
    : resource + 'Id';
  
  for (const [relatedResource, items] of Object.entries(data)) {
    if (relatedResource === resource || !Array.isArray(items)) continue;
    
    const itemsToDelete = items.filter(item => item[foreignKey] === itemId);
    
    if (itemsToDelete.length > 0) {
      if (!deletedItems[relatedResource]) {
        deletedItems[relatedResource] = [];
      }
      
      itemsToDelete.forEach(item => {
        deletedItems[relatedResource].push(item.id);
        
        const index = data[relatedResource].findIndex(i => i.id === item.id);
        if (index !== -1) {
          data[relatedResource].splice(index, 1);
        }
        
        const cascadeResult = deleteCascade(data, relatedResource, item.id);
        
        for (const [cascadeResource, cascadeIds] of Object.entries(cascadeResult)) {
          if (cascadeResource !== relatedResource) {
            if (!deletedItems[cascadeResource]) {
              deletedItems[cascadeResource] = [];
            }
            deletedItems[cascadeResource].push(...cascadeIds);
          }
        }
      });
    }
  }
  
  return deletedItems;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let dataPath;
    let data;
    
    const possiblePaths = [
      join(process.cwd(), 'backend-mock.json'),
      join(process.cwd(), 'api', 'backend-mock.json'),
      './backend-mock.json',
      '../backend-mock.json'
    ];
    
    for (const path of possiblePaths) {
      try {
        data = JSON.parse(readFileSync(path, 'utf-8'));
        dataPath = path;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!data) {
      throw new Error('backend-mock.json not found');
    }
    
    const [urlPath, queryString] = req.url.split('?');
    const pathParts = urlPath.replace(/^\/api\//, '').split('/').filter(Boolean);
    const params = new URLSearchParams(queryString || '');
    
    if (pathParts.length === 0) {
      return res.status(200).json(data);
    }
    
    const [resource, id] = pathParts;
    
    if (!data[resource]) {
      return res.status(404).json({ error: `Resource '${resource}' not found` });
    }
    
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const newItem = { ...body };
      
      const maxId = data[resource].reduce((max, item) => {
        const itemId = typeof item.id === 'number' ? item.id : parseInt(item.id) || 0;
        return Math.max(max, itemId);
      }, 0);
      
      newItem.id = maxId + 1;
      
      if (!newItem.createdAt) {
        newItem.createdAt = new Date().toISOString();
      }
      
      data[resource].push(newItem);
      writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
      
      return res.status(201).json(newItem);
    }
    
    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (!id) {
        return res.status(400).json({ error: 'ID is required for update' });
      }
      
      const body = await parseBody(req);
      
      const index = data[resource].findIndex(item => 
        item.id === id || item.id === parseInt(id) || item.id === Number(id)
      );
      
      if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      const updatedItem = req.method === 'PUT' 
        ? { ...body, id: data[resource][index].id }
        : { ...data[resource][index], ...body }

      updatedItem.updatedAt = new Date().toISOString();
      
      data[resource][index] = updatedItem;
      writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

      return res.status(200).json(updatedItem);
    }
    
    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'ID is required for deletion' });
      }
      
      const index = data[resource].findIndex(item => 
        item.id === id || item.id === parseInt(id) || item.id === Number(id)
      );
      
      if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      const deletedItem = data[resource][index];
      const itemIdToDelete = data[resource][index].id;
      
      data[resource].splice(index, 1);
      
      const cascadeResult = deleteCascade(data, resource, itemIdToDelete);
      
      writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
      
      return res.status(200).json({
        deleted: deletedItem,
        cascade: cascadeResult
      });
    }
    
    // GET
    let result = data[resource];
    
    if (id) {
      const item = result.find(item => 
        item.id === id || item.id === parseInt(id) || item.id === Number(id)
      );
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      result = processRelationships(item, data, params, resource);
      return res.status(200).json(result);
    }
    
    result = result.map(item => processRelationships(item, data, params, resource));
    
    for (const [key, value] of params.entries()) {
      if (!key.startsWith('_')) {
        result = result.filter(item => {
          const itemValue = String(item[key]);
          return itemValue === value;
        });
      }
    }
    
    const page = parseInt(params.get('_page')) || null;
    const limit = parseInt(params.get('_limit')) || null;
    
    if (page && limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      result = result.slice(start, end);
    } else if (limit) {
      result = result.slice(0, limit);
    }
    
    const sort = params.get('_sort');
    const order = params.get('_order') || 'asc';
    
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort];
        const bVal = b[sort];
        
        if (order === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      });
    }
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

function processRelationships(item, data, params, resource) {
  const result = { ...item };
  
  const embedParams = Array.from(params.entries())
    .filter(([key]) => key === '_embed')
    .map(([, value]) => value);
  
  for (const embedResource of embedParams) {
    let targetResource = embedResource;
    if (!data[targetResource]) {
      targetResource = embedResource + 's';
    }
    
    if (data[targetResource]) {
      const foreignKey = resource.endsWith('s') 
        ? resource.slice(0, -1) + 'Id' 
        : resource + 'Id';
      
      result[embedResource] = data[targetResource].filter(
        related => related[foreignKey] === item.id
      );
    }
  }
  
  const expandParams = Array.from(params.entries())
    .filter(([key]) => key === '_expand')
    .map(([, value]) => value);
  
  for (const expandResource of expandParams) {
    let targetResource = expandResource;
    if (!data[targetResource]) {
      targetResource = expandResource + 's';
    }
    
    if (data[targetResource]) {
      const foreignKey = expandResource + 'Id';
      
      if (item[foreignKey] !== undefined) {
        const relatedItem = data[targetResource].find(
          related => related.id === item[foreignKey]
        );
        
        if (relatedItem) {
          result[expandResource] = relatedItem;
        }
      }
    }
  }
  
  return result;
}