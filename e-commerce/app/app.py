from flask import Flask, request, jsonify, render_template
import os
import pandas as pd

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'data/uploads'
app.config['MAX_CONTENT_PATH'] = 16 * 1024 * 1024  # 16 MB upload limit

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        try:
            df = pd.read_csv(filepath)
            return jsonify({'message': 'Upload successful', 'filename': filename}), 200
        except Exception as e:
            return jsonify({'message': 'File processing failed', 'error': str(e)}), 400

    return jsonify({'message': 'File upload failed'}), 400

@app.route('/analyse', methods=['GET'])
def analyse_file():
    filename = request.args.get('filename')
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        df = pd.read_csv(filepath)
        head_html = df.head(100).to_html(classes='table table-striped')
        return jsonify({'head_html': head_html}), 200
    except Exception as e:
        return jsonify({'message': 'File processing failed', 'error': str(e)}), 400

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
