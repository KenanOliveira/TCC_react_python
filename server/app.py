from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
import config

app = Flask(__name__)

cors = CORS(app)

app.config['MONGO_DBNAME'] = config.DB_NAME
app.config['MONGO_URI'] = config.MONGO_URI
app.config['SECRET_KEY'] = config.SECRET_KEY

mongo = PyMongo(app)