from flask import Flask
from heart_blueprint import heart_blueprint
from liver_blueprint import liver_blueprint
from diabetes_blueprint import diabetes_blueprint
from kidney_blueprint import kidney_blueprint

app = Flask(__name__)

# Register blueprints
app.register_blueprint(heart_blueprint)
app.register_blueprint(liver_blueprint)
app.register_blueprint(diabetes_blueprint)
app.register_blueprint(kidney_blueprint)

if __name__ == '__main__':
    app.run(debug=True)












# from flask import Flask, request, jsonify
# from heart_blueprint import heart_blueprint
# from liver_blueprint import liver_blueprint
# from diabetes_blueprint import diabetes_blueprint
# from kidney_blueprint import kidney_blueprint

# app = Flask(__name__)

# # Register blueprints
# app.register_blueprint(heart_blueprint)
# app.register_blueprint(liver_blueprint)
# app.register_blueprint(diabetes_blueprint)
# app.register_blueprint(kidney_blueprint)

# # Endpoint to receive prediction result for diabetes
# @app.route('/diabetes_result', methods=['POST'])
# def diabetes_result():
#     prediction_result = request.json.get('prediction_result')
#     # Process the prediction result as needed
#     print('Received prediction result for diabetes:', prediction_result)
#     return jsonify({'message': 'Prediction result received successfully'})

# # Endpoint to receive prediction result for heart disease
# @app.route('/heart_result', methods=['POST'])
# def heart_result():
#     prediction_result = request.json.get('prediction_result')
#     # Process the prediction result as needed
#     print('Received prediction result for heart disease:', prediction_result)
#     return jsonify({'message': 'Prediction result received successfully'})

# # Endpoint to receive prediction result for liver disease
# @app.route('/liver_result', methods=['POST'])
# def liver_result():
#     prediction_result = request.json.get('prediction_result')
#     # Process the prediction result as needed
#     print('Received prediction result for liver disease:', prediction_result)
#     return jsonify({'message': 'Prediction result received successfully'})

# # Endpoint to receive prediction result for kidney disease
# @app.route('/kidney_result', methods=['POST'])
# def kidney_result():
#     prediction_result = request.json.get('prediction_result')
#     # Process the prediction result as needed
#     print('Received prediction result for kidney disease:', prediction_result)
#     return jsonify({'message': 'Prediction result received successfully'})

# if __name__ == '__main__':
#     app.run(debug=True)
