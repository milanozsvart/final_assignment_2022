from flask import Flask

app = Flask(__name__)

from backend_betting_app import routes
