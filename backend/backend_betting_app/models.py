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
    betsPlaced = db.relationship('BetEvent', backref='match', lazy=True)

    def __repr__(self):
        return f"Match('{self.date}', '{self.time}', '{self.tier}', '{self.round}', '{self.firstPlayer}', {self.secondPlayer}', '{self.firstOdds}', '{self.secondOdds}', '{self.result}'"


class Dates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True)
    checked = db.Column(db.Boolean, nullable=True, default=False)
    resultChecked = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"Dates({self.date}, {self.checked})"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    dateJoined = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow())
    bets = db.relationship('Bet', backref='owner', lazy=True)

    def __repr__(self):
        return f"User({self.email}, {self.password}, {self.dateJoined}"


class BetEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    matchId = db.Column(db.Integer, db.ForeignKey('match.id'))
    bettedOn = db.Column(db.String(35), nullable=False)
    betId = db.Column(db.Integer, db.ForeignKey(
        'bet.id'), nullable=False)


class Bet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    betEvents = db.relationship('BetEvent', backref='bet_event', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now())
    betName = db.Column(db.String(50), nullable=True)
