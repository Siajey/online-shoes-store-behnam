import type { ShippingOptionDto } from "./dto";
import type { ShippingOption } from "./types";

export function toShippingOption(dto: ShippingOptionDto): ShippingOption {
  const available = dto.available === true;
  const isFree = available && dto.isFree === true;
  return {
    code: dto.methodCode,
    name: dto.name,
    description: dto.description ?? null,
    available,
    fee: available && !isFree ? Math.max(0, dto.fee ?? 0) : 0,
    isFree,
    days: available && dto.estimatedDays ? dto.estimatedDays : null,
  };
}
