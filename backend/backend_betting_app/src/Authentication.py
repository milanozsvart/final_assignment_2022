from backend_betting_app import bcrypt
from backend_betting_app import db
from backend_betting_app.models import User
import jwt
import os


class Authenctication:
    def __init__(self):
        pass

    def checkPassword(self, passwordGiven, actualPassword):
        return bcrypt.check_password_hash(actualPassword, passwordGiven)

    def login(self, email, password):
        user = User.query.filter_by(email=email).first()
        if user and self.checkPassword(password, user.password):
            token = jwt.encode(
                {'user': email}, os.environ.get('JWT_SECRET_KEY'), algorithm="HS256")
            return {"successful": True, "token": token}
        elif not user:
            return {"message": f"There is no account registered with this email address: {email}", "successful": False}
        elif user and not self.checkPassword(password, user.password):
            return {"message": f"Wrong password, please try again!", "successful": False}
        else:
            return {"message": f"Unknown error occured! Please try again!", "successful": False}

    def register(self, email, password):
        hashedPassword = bcrypt.generate_password_hash(
            password).decode('utf-8')
        db.create_all()
        exists = db.session.query(db.exists().where(
            User.email == email)).scalar()
        if not exists:
            db.session.add(User(email=email, password=hashedPassword))
            db.session.commit()
            return {"message": f"Account created for {email}", "successful": True}
        else:
            return {"message": f"There is already an account registered with this email address: {email}", "successful": False}

    def changePassword(self, token, currentPassword, newPassword):
        userEmail = jwt.decode(
            token, os.environ.get('JWT_SECRET_KEY'), algorithms=["HS256"])["user"]
        user = User.query.filter_by(email=userEmail).first()
        if user and bcrypt.check_password_hash(user.password, currentPassword):
            user.password = bcrypt.generate_password_hash(
                newPassword).decode('utf-8')
            db.session.commit()
            return {"message": "Successfully changed your password!", "successful": True}
        if not bcrypt.check_password_hash(user.password, currentPassword):
            return {"message": "This is not your current password, please try again!", "successful": False}
