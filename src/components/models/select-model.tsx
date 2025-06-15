import { useModelStore } from "@/lib/stores/model-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { models } from "@/utils/models";

export function SelectModel() {
  const { model, setModel } = useModelStore();

  return (
    <Select value={model} onValueChange={setModel}>
      <SelectTrigger className="w-[200px] border-0 bg-transparent focus:ring-0">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model} value={model}>{model}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}