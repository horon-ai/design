import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@horon/web";

const PROFILE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23b08968'/%3E%3C/svg%3E";

export default function AvatarDemo() {
  return (
    <>
      <Avatar>
        <AvatarImage src={PROFILE_IMAGE} alt="김민수 프로필" />
        <AvatarFallback>김민</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={PROFILE_IMAGE} alt="김민수 프로필" />
        <AvatarFallback>김민</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>이서</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>김</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>이</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>박</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </>
  );
}
