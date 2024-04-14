from app import jsonify, app, mongo, request, cross_origin
from bson import json_util, ObjectId, errors
import json
import datetime
import bcrypt
import jwt
import base64

'''
#################     FUNÇÕES DE MANIPULAÇÃO     #################
'''
def ObjectId_to_id(oid):
    id = json.loads(json_util.dumps(oid))
    return id['$oid']

def Verificar_link(link):
    return link[:43].replace('watch?v=', 'embed/')

def Criar_thumb(link):
    id = link.replace('https://www.youtube.com/embed/', '')
    return 'https://img.youtube.com/vi/'+id[:11]+'/maxresdefault.jpg'


'''
#################     METODOS COMUNS VIDEOS     #################
'''
@app.route('/inserir', methods=['POST'])
@cross_origin()
def inserir():
    titulo = request.json['titulo']
    descricao = request.json['descricao']
    data_upload = datetime.datetime.utcnow()
    tags = request.json['tags']
    link = Verificar_link(request.json['link'])
    thumb = Criar_thumb(link)

    try:
        mongo.db.videos.insert_one({'titulo': titulo, 'descricao': descricao, 'data_upload': data_upload, 'tags': tags, 'link': link, 'thumb': thumb})
        return jsonify({'result': 'Inserido'}), 200
    except:
        return jsonify({'result': 'Erro'}), 500


@app.route('/buscaTodos', methods=['GET'])
@cross_origin()
def buscaTodos():
    videos = mongo.db.videos

    out = []

    for v in videos.find().sort({'data_upload': -1}).limit(25):
        _id = ObjectId_to_id(v['_id'])
        out.append({'_id': _id, 'titulo': v['titulo'], 'data_upload': v['data_upload'], 'thumb': v['thumb']})
    
    if len(out) > 0:
        return jsonify({'result': out})
    
    return jsonify({'resultado': []})

@app.route('/buscaUnico/<id>', methods=['GET'])
@cross_origin()
def buscaUnico(id):
    try:
        busca = mongo.db.videos.find_one({'_id': ObjectId(id)})
        _id = ObjectId_to_id(busca['_id'])
        titulo = busca['titulo']
        descricao = busca['descricao']
        data_upload = busca['data_upload']
        tags = busca['tags']
        link = busca['link']
        thumb = busca['thumb']

        if titulo and descricao and data_upload and tags and link:
            return jsonify({'result': {'_id': _id, 'titulo': titulo, 'descricao': descricao, 'data_upload': data_upload, 'tags': tags, 'link': link, 'thumb': thumb}})
        
        return jsonify({'result': 'Nada'}), 404
    except errors.InvalidId:
        return jsonify({'result': 'Id invalido'}), 400
    except:
        print(busca)
        return jsonify({'result': 'Erro no banco de dados'}), 500

@app.route('/atualizaVideo/<id>', methods=['PUT'])
@cross_origin()
def atualizaVideo(id):
    titulo = request.json['titulo']
    descricao = request.json['descricao']
    tags = request.json['tags']

    try:
        mongo.db.videos.find_one_and_update({'_id': ObjectId(id)}, {'$set': {'titulo': titulo, 'descricao': descricao, 'tags': tags}})
        return jsonify({'result': 'Sucesso'}), 200
    except:
        return jsonify({'result': 'Erro'}), 500

@app.route('/deletaVideo/<id>', methods=['DELETE'])
@cross_origin()
def deletaVideo(id):
    try:
        mongo.db.videos.find_one_and_delete({'_id': ObjectId(id)})
        return jsonify({'result': 'Deletado'}), 200
    except:
        return jsonify({'result': 'Erro'}), 500


'''
#################     METODOS COMUNS USERS     #################
'''
@app.route('/cadastro', methods=['POST'])
@cross_origin()
def cadastro():
    nome = request.json['nome']
    sobrenome = request.json['sobrenome']
    email = request.json['email']
    pwd = request.json['pwd']
    avatar = request.json['avatar']

    salt = bcrypt.gensalt()

    hashed_pwd = bcrypt.hashpw(pwd.encode('utf-8'), salt)

    try:
        mongo.db.users.insert_one({'nome': nome, 'sobrenome': sobrenome, 'email': email, 'salt': salt, 'hash': hashed_pwd, 'avatar': avatar})
        return jsonify({'result': 'Cadastrado'}), 200
    except:
        return jsonify({'result': 'Erro'}), 500

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    email = request.json['email']
    pwd = request.json['pwd']

    user = mongo.db.users.find_one({'email': email})

    if user and bcrypt.checkpw(pwd.encode('utf-8'), user['hash']):
        token = jwt.encode({'email': email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'result': {'token': token, 'avatar': user['avatar'], 'user': user['nome']}}), 200
    else:
        return jsonify({'message': 'Credenciais inválidas'}), 401

@app.route('/buscaUsers', methods=['GET'])
@cross_origin()
def buscaUsers():
    busca = mongo.db.users

    out = []

    for b in busca.find():
        _id = ObjectId_to_id(b['_id'])
        out.append({'_id': _id, 'avatar': b['avatar'], 'nome': b['nome'], 'sobrenome': b['sobrenome']})
    
    return jsonify({'result': out})

@app.route('/buscaUser/<id>', methods=['GET'])
@cross_origin()
def buscaUser(id):
    try:
        user = mongo.db.users.find_one({'_id': ObjectId(id)})

        if (user):
            return jsonify({'result': {'_id': ObjectId_to_id(user['_id']), 'nome': user['nome'], 'sobrenome': user['sobrenome'], 'email': user['email']}}), 200
        return jsonify({'result': {}}), 404
    except:
        return jsonify({'result': "Erro"}), 500

@app.route('/atualizaUser/<id>', methods=['PUT'])
@cross_origin()
def atualizaUser(id):
    nome = request.json['nome']
    sobrenome = request.json['sobrenome']
    email = request.json['email']
    pwd = request.json['pwd']
    avatar = request.json['avatar']

    if (pwd != ''):
        salt = bcrypt.gensalt()
        hashed_pwd = bcrypt.hashpw(pwd.encode('utf-8'), salt)
        try:
            busca = mongo.db.users.find_one_and_update({'_id': ObjectId(id)}, {'$set': {'nome': nome, 'sobrenome': sobrenome, 'email': email, 'avatar': avatar, 'salt': salt, 'hash': hashed_pwd}})
            if busca:
                return jsonify({'result': 'Sucesso'}), 200
            return jsonify({'result': 'Nao achei'}), 404
        except:
            return jsonify({'result': "Erro"}), 500
    else:
        try:
            busca = mongo.db.users.find_one_and_update({'_id': ObjectId(id)}, {'$set': {'nome': nome, 'sobrenome': sobrenome, 'email': email, 'avatar': avatar}})
            if busca:
                return jsonify({'result': 'Sucesso'}), 200
            return jsonify({'result': 'Nao achei'}), 404
        except:
            return jsonify({'result': "Erro"}), 500

@app.route('/deletaUser/<id>', methods=['DELETE'])
@cross_origin()
def deletaUser(id):
    try:
        busca = mongo.db.users.find_one_and_delete({'_id': ObjectId(id)})

        if busca:
            return jsonify({'result': 'Deletado'}), 200
        else:
            return jsonify({'result': 'Usuário nao encontrado'}), 404
    except:
        return jsonify({'result': 'Erro'}), 500


'''
#################     BUSCAS     #################
'''
@app.route('/buscar/<busca>', methods=['GET'])
@cross_origin()
def buscar(busca):
    busca = busca.replace('+', ' ').split()
    try:
        query = {'$or': [{'titulo': {'$regex': termo}} for termo in busca] + [{'descricao': {'$regex': termo}} for termo in busca] + [{'tags': {'$regex': termo}} for termo in busca]}

        resultados_distintos = mongo.db.videos.find(query).distinct('_id')

        resultados = mongo.db.videos.find({'_id': {'$in': resultados_distintos}})

        out = []

        for r in resultados:
            out.append({'_id': ObjectId_to_id(r['_id']), 'titulo': r['titulo'], 'descricao': r['descricao'], 'tags': r['tags'], 'link': r['link'], 'thumb': r['thumb']})
        
        if len(out) > 0:
            return jsonify({'result': out, 'qtd': len(out)}), 200
        else:
            return jsonify({'result': []}), 404
    except:
        return jsonify({'result': 'Erro'}), 500

@app.route('/buscaInicio', methods=['GET'])
@cross_origin()
def buscaInicio():
    videos = mongo.db.videos

    out = []

    for v in videos.find().sort({'data_upload': -1}).limit(5):
        _id = ObjectId_to_id(v['_id'])
        out.append({'_id': _id, 'titulo': v['titulo'], 'data_upload': v['data_upload'], 'thumb': v['thumb']})
    
    if len(out) > 0:
        return jsonify({'result': out})
    
    return jsonify({'resultado': []})


'''
#################     ERRO 404 NOT FOUND     #################
'''
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Nada foi encontrado'}), 404


'''
#################     INICIAR APP     #################
'''
if __name__ == '__main__':
    app.run()