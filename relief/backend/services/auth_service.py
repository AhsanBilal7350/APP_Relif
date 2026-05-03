from firebase_admin import auth
from schemas.user import UserRequest

class AuthService:
    @staticmethod
    def create_user(user: UserRequest):
        try:
            new_user = auth.create_user(email=user.email, password=user.password)
            return {"status": "success", "uid": new_user.uid}
        except auth.EmailAlreadyExistsError:
            raise ValueError("This email is already registered.")
        except Exception as e:
            raise ValueError(f"Failed to create user: {str(e)}")

    @staticmethod
    def login_user(user: UserRequest):
        """
        Note: Firebase Admin SDK cannot verify passwords server-side.
        Password verification is handled by Firebase Client SDK on the frontend.
        This endpoint verifies that the user exists and returns their profile info.
        """
        try:
            user_record = auth.get_user_by_email(user.email)
            if user_record.disabled:
                raise ValueError("This account has been disabled.")
            return {
                "status": "success",
                "uid": user_record.uid,
                "email": user_record.email,
                "email_verified": user_record.email_verified
            }
        except auth.UserNotFoundError:
            raise ValueError("No account found with this email address.")
        except ValueError:
            raise
        except Exception as e:
            raise ValueError(f"Authentication error: {str(e)}")
