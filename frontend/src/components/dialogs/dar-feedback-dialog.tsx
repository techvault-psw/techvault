import { type ReactNode } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { pacotes } from "@/consts/pacotes";
import { StarRating } from "../ui/star-rating";

interface DarFeedbackDialogProps {
  children: ReactNode
}

export const DarFeedbackDialog = ({ children }: DarFeedbackDialogProps) => {
  const [selectedPack, setSelectedPack] = useState<string | undefined>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  return (
    <Dialog.Container>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Dar feedback</Dialog.Title>

        <Separator />

        <div className="space-y-2">
            <label className="block font-medium text-gray leading-none">Pacote</label>
            <Select onValueChange={setSelectedPack}>
                <SelectTrigger className="w-full text-white">
                    <SelectValue className="text-gray-200" placeholder="Escolher pacote"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {pacotes.map((p, index) => (
                        <SelectItem key={index} value={String(index)}>
                            {p.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
          <label className="block font-medium text-gray leading-none">Estrelas</label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        <div className="space-y-2">
          <label htmlFor="comment-new" className="block font-medium text-gray leading-none">
            Comentário
          </label>
          <textarea
            id="comment-new"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-28 max-h-52 w-full rounded-lg px-3 py-2 bg-gray/5 backdrop-blur-sm border border-gray/50 text-white leading-[130%] focus:outline-none"
          />
        </div>

        <Dialog.Footer>
          <Dialog.Close asChild>    
            <Button variant="outline"> 
              Cancelar
            </Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button className="h-[2.625rem]">
              Confirmar
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
};
