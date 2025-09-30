import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
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