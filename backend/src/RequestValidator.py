from cerberus import Validator
from datetime import datetime


class RequestValidator:
    additionalPropsSchema = {'court': {'type': 'string',
                                       'allowed': ['all', 'hard', 'clay', 'grass'], "required": True},
                             'tournament': {'type': 'string', 'allowed': ['All', 'WTA125', 'WTA250', 'WTA500', 'WTA1000', 'Grand Slam'], "required": True},
                             'round': {'type': 'string', 'allowed': ['All', 'Other', 'Quarterfinals', 'Semifinals', 'The final'], "required": True},
                             'startdate': {'type': 'datetime', 'coerce': lambda s: datetime.strptime(s, '%Y-%m-%d'), "required": True}}

    singlePlayerSchema = {"playerName": {"type": "string", "required": True},
                          "additionalProps": {"type": "dict", "schema": additionalPropsSchema, "required": True}}

    multiplePlayerSchema = {"playerName": {"type": "list", "required": True},
                            "additionalProps": {"type": "dict", "schema": additionalPropsSchema, "required": True}}

    matchesSchema = {"playerName": {"type": "string", "required": True},
                     "additionalProps": {"type": "dict", "schema": additionalPropsSchema, "required": True}, 'opponentRanks': {'type': 'string', "required": True}, 'category': {'type': 'string', "required": True, "allowed": ['all', 'won', 'won-2-0', 'lost']}}

    reachedPlayerSchema = {"partOfPlayerName": {
        "type": "string", "required": True}}

    emailPasswordSchema = {'email': {
        'type': 'string', 'regex': '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', 'required': True}, 'password': {'type': 'string', 'required': True}}

    changePasswordSchema = {'token': {'type': 'string', 'required': True}, 'currentPassword': {
        'type': 'string', 'required': True}, 'newPassword': {'type': 'string', 'required': True}}

    betSchema = {'date': {'type': 'string', 'required': True}, 'firstOdds': {'type': 'float', 'coerce': float}, 'firstPlayer': {'type': 'string', 'required': True}, 'id': {'type': 'integer', 'coerce': int}, 'result': {'type': 'string', 'nullable': True}, 'round': {'type': 'string', 'required': True},
                 'secondOdds': {'type': 'float', 'coerce': float}, 'secondPlayer': {'type': 'string', 'required': True}, 'tier': {'type': 'string', 'required': True}, 'pred': {'type': 'dict', 'schema': {'player': {'type': 'string', 'required': True}, 'points': {'type': 'float', 'coerce': float}}}}

    addToBetsSchema = {'token': {'type': 'string', 'required': True}, 'betsName': {
        'type': 'string', 'required': True}, 'bets': {'type': 'list', 'schema': {'type': 'dict', 'schema': betSchema}}}

    getUserBets = {'token': {'type': 'string', 'required': True}, 'betType': {
        'type': 'string', 'allowed': ['Pending', 'Won', 'Lost', 'all']}}

    def __init__(self):
        self.v = Validator()

    def validate(self, request, schema):
        return self.v.validate(request, schema)

    def getErrors(self):
        return self.v.errors
