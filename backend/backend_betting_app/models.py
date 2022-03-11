from backend_betting_app import db


class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    tier = db.Column(db.String(20), nullable=False)
    round = db.Column(db.String(20), nullable=False)
    firstPlayer = db.Column(db.String(35), nullable=False)
    secondPlayer = db.Column(db.String(35), nullable=False)
    firstOdds = db.Column(db.Float(), nullable=False)
    secondOdds = db.Column(db.Float(), nullable=False)

    def __repr__(self):
        return f"Match('{self.date}', '{self.tier}', '{self.round}', '{self.firstPlayer}', {self.secondPlayer}', '{self.firstOdds}', '{self.secondOdds}'"


class Dates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
