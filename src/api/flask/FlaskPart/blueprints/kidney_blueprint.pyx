from flask import Blueprint, jsonify, request
import joblib
import numpy as np

kidney_blueprint = Blueprint('kidney', __name__)

try:
    model = joblib.load('../models/Kidney_Trained_Model.pkl')
except FileNotFoundError:
    print("Model file not found. Please check the file path.")
    model = None
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    model = None

@kidney_blueprint.route('/kidney_predict', methods=['POST'])
def kidney_predict():
    if model is None:
        return jsonify({'error': 'Model not available'}), 500
    
    try:
        data = request.json
        
        features = np.array([data['sg'], data['al'], data['hemo'], data['pcv'],data['rc']]).reshape(1, -1)
        prediction = model.predict(features)
        
        return jsonify({'prediction': prediction.tolist()}), 200
    except KeyError:
        return jsonify({'error': 'Required fields are missing in the input data'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500
