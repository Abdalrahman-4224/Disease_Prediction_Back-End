from flask import Blueprint, jsonify, request
import joblib
import numpy as np

liver_blueprint = Blueprint('liver', __name__)

try:
    model = joblib.load('../models/liver_trained_model.pkl')
except FileNotFoundError:
    print("Model file not found. Please check the file path.")
    model = None
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    model = None

@liver_blueprint.route('/liver_predict', methods=['POST'])
def liver_predict():
    if model is None:
        return jsonify({'error': 'Model not available'}), 500
    
    try:
        data = request.json
        print("data")
        print(data)
        data = request.json
        
        features = np.array([data['age'], data['gender2'], data['Total_Bilirubin'], 
                             data['Direct_Bilirubin'], data['Alkaline_Phosphotase'], 
                             data['Alamine_Aminotransferase'], data['Aspartate_Aminotransferase'], 
                             data['Total_Protiens'], data['Albumin'], 
                             data['Albumin_and_Globulin_Ratio']]).reshape(1, -1)
        
        prediction = model.predict(features)
        
        return jsonify({'prediction': prediction.tolist()}), 200
    except KeyError:
        return jsonify({'error': 'Required fields are missing in the input data'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500
