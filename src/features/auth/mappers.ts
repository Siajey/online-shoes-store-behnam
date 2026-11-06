import type { UserDto } from "./dto";
import type { User } from "./types";

export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    phoneNumber: dto.phoneNumber,
    role: dto.role,
    status: dto.status,
    hasProfile: dto.profile != null,
    firstName: dto.profile?.firstName ?? undefined,
    lastName: dto.profile?.lastName ?? undefined,
  };
}
