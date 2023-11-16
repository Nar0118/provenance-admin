import { AuthService } from './authService';
import { EventService } from './eventService';
import { UserService } from './userService';

export const GlobalServices = ({ children }): JSX.Element => {
  return (
    <AuthService>
      <UserService>
        <EventService>{children}</EventService>
      </UserService>
    </AuthService>
  );
};
