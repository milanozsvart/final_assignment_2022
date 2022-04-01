from email.policy import default
from backend_betting_app import db
from datetime import datetime


class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    tier = db.Column(db.String(20), nullable=False)
    round = db.Column(db.String(20), nullable=False)
    firstPlayer = db.Column(db.String(35), nullable=False)
    secondPlayer = db.Column(db.String(35), nullable=False)
    firstOdds = db.Column(db.Float(), nullable=False)
    secondOdds = db.Column(db.Float(), nullable=False)
    result = db.Column(db.String(35))
    bets = db.relationship('Bets', backref='match', lazy=True)

    def __repr__(self):
        return f"Match('{self.date}', '{self.time}', '{self.tier}', '{self.round}', '{self.firstPlayer}', {self.secondPlayer}', '{self.firstOdds}', '{self.secondOdds}', '{self.result}'"


class Dates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True)
    checked = db.Column(db.Boolean, nullable=True, default=False)

    def __repr__(self):
        return f"Dates({self.date}, {self.checked})"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    dateJoined = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow())

    def __repr__(self):
        return f"User({self.email}, {self.password}, {self.dateJoined}"


class Bet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    matchId = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    bettedOn = db.Column(db.String(35), nullable=False)
