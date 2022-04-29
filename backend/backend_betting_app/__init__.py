from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
import sys
import os
from datetime import date
from pathlib import Path
sys.path.append(
    str(Path(os.path.dirname(os.path.realpath(__file__)) + "\src")))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db, render_as_batch=True)
bcrypt = Bcrypt(app)


from backend_betting_app import routes
from backend_betting_app.routes import get_todays_matches_from_api, get_today_odds

sched = BackgroundScheduler(daemon=True)
sched.add_job(get_today_odds, 'interval', hours=3)
sched.add_job(lambda: get_todays_matches_from_api(
    date.today().isoformat()), 'interval', hours=6)
sched.start()
atexit.register(lambda: sched.shutdown(wait=False))
