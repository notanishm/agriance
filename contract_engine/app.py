# Contract Generation Engine - Flask API
# Deploy to Render: pip install -r requirements.txt

from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
from fpdf import FPDF
import datetime
import uuid
import io
import os

app = Flask(__name__)
CORS(app)

INPUT_FORM = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agriance Contract Generator</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 900px; margin: 0 auto; }
        .header { text-align: center; color: white; margin-bottom: 2rem; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .card { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
        .card h2 { color: #1a472a; border-bottom: 2px solid #1a472a; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #333; }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;
        }
        .form-group input:focus { outline: none; border-color: #1a472a; }
        .form-group textarea { min-height: 80px; resize: vertical; }
        .checkbox-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .checkbox-item { display: flex; align-items: center; gap: 0.5rem; }
        .btn {
            background: #1a472a; color: white; border: none; padding: 1rem 2rem;
            font-size: 1.1rem; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Agriance Contract Generator</h1>
        </div>
        <form method="POST" action="/generate" target="_blank">
            <div class="card">
                <h2>Contract Details</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contract Number</label>
                        <input type="text" name="contract_number" value="CRT-{{contract_num}}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Contract Date</label>
                        <input type="date" name="contract_date" value="{{today}}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Crop Name *</label>
                        <input type="text" name="crop_name" placeholder="e.g., Organic Wheat" required>
                    </div>
                    <div class="form-group">
                        <label>Quantity (Quintals) *</label>
                        <input type="number" name="quantity" placeholder="100" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price per Quintal (Rs.) *</label>
                        <input type="number" name="price" placeholder="2500" required>
                    </div>
                    <div class="form-group">
                        <label>Delivery Date *</label>
                        <input type="date" name="delivery_date" required>
                    </div>
                </div>
            </div>
            <div class="card">
                <h2>Farmer Details (Party A)</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Farmer Name *</label>
                        <input type="text" name="farmer_name" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="farmer_phone">
                    </div>
                </div>
                <div class="form-group">
                    <label>Location *</label>
                    <input type="text" name="farmer_location" required>
                </div>
                <div class="form-group">
                    <label>Land Size (Hectares)</label>
                    <input type="number" step="0.01" name="farmer_land_size">
                </div>
            </div>
            <div class="card">
                <h2>Business Details (Party B)</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Company Name *</label>
                        <input type="text" name="business_name" required>
                    </div>
                    <div class="form-group">
                        <label>Contact Person *</label>
                        <input type="text" name="business_contact" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>GST Number</label>
                        <input type="text" name="business_gst">
                    </div>
                    <div class="form-group">
                        <label>Business Phone</label>
                        <input type="text" name="business_phone">
                    </div>
                </div>
            </div>
            <div class="card">
                <h2>Farming Methods</h2>
                <div class="checkbox-group">
                    <div class="checkbox-item"><input type="checkbox" name="farming_methods" value="Organic"> <span>Organic</span></div>
                    <div class="checkbox-item"><input type="checkbox" name="farming_methods" value="Natural Farming"> <span>Natural</span></div>
                    <div class="checkbox-item"><input type="checkbox" name="farming_methods" value="IPM"> <span>IPM</span></div>
                    <div class="checkbox-item"><input type="checkbox" name="farming_methods" value="Drip Irrigation"> <span>Drip</span></div>
                    <div class="checkbox-item"><input type="checkbox" name="farming_methods" value="Sprinkler"> <span>Sprinkler</span></div>
                    <div class="checkbox-item"><input type="checkbox" name="farming_methods" value="Green Manure"> <span>Green Manure</span></div>
                </div>
                <div class="form-group" style="margin-top:1rem">
                    <label>Equipment Provided</label>
                    <textarea name="equipment" placeholder="List equipment, seeds, fertilizers..."></textarea>
                </div>
            </div>
            <div class="card">
                <h2>Payment Structure</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>Advance %</label>
                        <input type="number" name="advance_percent" value="30">
                    </div>
                    <div class="form-group">
                        <label>On Delivery %</label>
                        <input type="number" name="delivery_percent" value="50">
                    </div>
                    <div class="form-group">
                        <label>Quality Check %</label>
                        <input type="number" name="quality_percent" value="20">
                    </div>
                </div>
                <div class="form-group">
                    <label>Payment Mode</label>
                    <select name="payment_mode">
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn">Generate Contract PDF</button>
        </form>
    </div>
</body>
</html>"""

class ContractPDF(FPDF):
    def header(self):
        pass

    def footer(self):
        pass

def generate_contract(data):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=False)
    
    margin = 10
    pdf.set_margins(margin, margin, margin)
    pdf.set_font('Helvetica', '', 9)
    
    pdf.set_font('Helvetica', 'B', 13)
    pdf.cell(0, 8, 'AGRICULTURAL PRODUCE PURCHASE CONTRACT', 0, 1, 'C')
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(95, 6, f"Contract No: {data.get('contract_number', 'N/A')}", 0, 0)
    pdf.cell(0, 6, f"Date: {data.get('contract_date', datetime.datetime.now().strftime('%d-%m-%Y'))}", 0, 1, 'R')
    pdf.ln(3)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(0, 6, 'PARTIES TO THIS CONTRACT:', 0, 1)
    pdf.set_font('Helvetica', '', 9)
    
    pdf.cell(5, 5, 'A.', 0, 0)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(35, 5, 'PRODUCER (Farmer):', 0, 0)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, f"{data.get('farmer_name', 'N/A')}", 0, 1)
    
    pdf.cell(40, 5, '', 0, 0)
    pdf.cell(0, 5, f"{data.get('farmer_location', 'N/A')}", 0, 1)
    
    pdf.cell(40, 5, '', 0, 0)
    pdf.cell(0, 5, f"Phone: {data.get('farmer_phone', 'N/A')}  |  Land: {data.get('farmer_land_size', 'N/A')} Hectares", 0, 1)
    pdf.ln(2)
    
    pdf.cell(5, 5, 'B.', 0, 0)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(35, 5, 'BUYER (Company):', 0, 0)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, f"{data.get('business_name', 'N/A')}", 0, 1)
    
    pdf.cell(40, 5, '', 0, 0)
    pdf.cell(0, 5, f"Contact: {data.get('business_contact', 'N/A')}  |  GST: {data.get('business_gst', 'N/A')}", 0, 1)
    pdf.ln(4)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(0, 6, 'CONTRACT TERMS:', 0, 1)
    
    pdf.set_font('Helvetica', '', 8)
    pdf.set_fill_color(240, 240, 240)
    
    pdf.cell(60, 6, 'Description', 1, 0, 'C', True)
    pdf.cell(0, 6, 'Details', 1, 1, 'C', True)
    
    total = int(data.get('quantity', 0)) * int(data.get('price', 0))
    
    pdf.cell(60, 6, 'Crop Name', 1, 0)
    pdf.cell(0, 6, str(data.get('crop_name', 'N/A')), 1, 1)
    
    pdf.cell(60, 6, 'Quantity', 1, 0)
    pdf.cell(0, 6, f"{data.get('quantity', 'N/A')} Quintals", 1, 1)
    
    pdf.cell(60, 6, 'Price per Quintal', 1, 0)
    pdf.cell(0, 6, f"Rs. {data.get('price', 'N/A')}", 1, 1)
    
    pdf.cell(60, 6, 'Total Contract Value', 1, 0)
    pdf.cell(0, 6, f"Rs. {total:,}", 1, 1)
    
    pdf.cell(60, 6, 'Delivery Date', 1, 0)
    pdf.cell(0, 6, str(data.get('delivery_date', 'N/A')), 1, 1)
    
    farming_methods = data.get('farming_methods', [])
    if isinstance(farming_methods, str):
        farming_methods = [farming_methods]
    
    pdf.cell(60, 6, 'Farming Methods', 1, 0)
    pdf.cell(0, 6, ', '.join(farming_methods) if farming_methods else 'Standard', 1, 1)
    
    pdf.cell(60, 6, 'Equipment Provided', 1, 0)
    equipment = str(data.get('equipment', 'None'))[:60]
    pdf.cell(0, 6, equipment, 1, 1)
    pdf.ln(4)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(0, 6, 'PAYMENT STRUCTURE:', 0, 1)
    pdf.set_font('Helvetica', '', 8)
    
    pdf.cell(32, 6, f"Advance: {data.get('advance_percent', '30')}%", 1, 0, 'C')
    pdf.cell(32, 6, f"On Delivery: {data.get('delivery_percent', '50')}%", 1, 0, 'C')
    pdf.cell(32, 6, f"Quality Check: {data.get('quality_percent', '20')}%", 1, 0, 'C')
    pdf.cell(0, 6, f"Mode: {data.get('payment_mode', 'Bank Transfer')}", 1, 1, 'C')
    pdf.ln(4)
    
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(95, 5, 'Producer Obligations:', 0, 0)
    pdf.cell(0, 5, 'Buyer Obligations:', 0, 1)
    pdf.set_font('Helvetica', '', 7)
    
    pdf.cell(95, 4, '- Cultivate as per agreed farming methods', 0, 0)
    pdf.cell(0, 4, '- Provide equipment/inputs in time', 0, 1)
    
    pdf.cell(95, 4, '- Maintain cultivation records', 0, 0)
    pdf.cell(0, 4, '- Make payments as per schedule', 0, 1)
    
    pdf.cell(95, 4, '- Deliver produce on agreed date', 0, 0)
    pdf.cell(0, 4, '- Accept quality produce', 0, 1)
    
    pdf.cell(95, 4, '- Ensure quality standards are met', 0, 0)
    pdf.cell(0, 4, '- Honor contract in good faith', 0, 1)
    pdf.ln(4)
    
    pdf.set_font('Helvetica', 'I', 7)
    pdf.cell(0, 4, 'Force Majeure: Neither party liable for delays due to natural disasters, war, epidemics.', 0, 1)
    pdf.cell(0, 4, 'Dispute Resolution: Mutual discussion within 30 days, then arbitration under Indian laws.', 0, 1)
    pdf.ln(6)
    
    pdf.set_font('Helvetica', 'B', 10)
    
    pdf.cell(95, 6, 'PRODUCER (Party A):', 0, 1)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(95, 5, f"Name: {data.get('farmer_name', 'N/A')}", 0, 1)
    pdf.cell(95, 5, f"Location: {data.get('farmer_location', 'N/A')}", 0, 1)
    pdf.ln(8)
    
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.3)
    pdf.line(10, pdf.get_y(), 90, pdf.get_y())
    pdf.cell(40, 5, 'Signature', 0, 0)
    pdf.cell(50, 5, 'Date: ____________', 0, 1, 'R')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(95, 6, 'BUYER (Party B):', 0, 1)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(95, 5, f"Company: {data.get('business_name', 'N/A')}", 0, 1)
    pdf.cell(95, 5, f"Contact Person: {data.get('business_contact', 'N/A')}", 0, 1)
    pdf.ln(8)
    
    pdf.line(10, pdf.get_y(), 90, pdf.get_y())
    pdf.cell(40, 5, 'Signature', 0, 0)
    pdf.cell(50, 5, 'Date: ____________', 0, 1, 'R')
    pdf.ln(10)
    
    pdf.set_font('Helvetica', '', 8)
    pdf.cell(95, 5, 'Witness 1: _________________________', 0, 0)
    pdf.cell(0, 5, 'Witness 2: _________________________', 0, 1)
    pdf.ln(8)
    
    pdf.set_font('Helvetica', 'I', 6)
    pdf.set_text_color(128, 128, 128)
    pdf.cell(0, 4, f"Generated on {datetime.datetime.now().strftime('%d-%m-%Y at %H:%M')} | Agriance", 0, 0, 'C')
    
    return pdf

@app.route('/')
def index():
    contract_num = f"{datetime.datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    return render_template_string(INPUT_FORM, contract_num=contract_num, today=datetime.datetime.now().strftime('%Y-%m-%d'))

@app.route('/api/generate', methods=['POST'])
def api_generate():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['crop_name', 'quantity', 'price', 'delivery_date', 'farmer_name', 'farmer_location', 'business_name', 'business_contact']
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        pdf = generate_contract(data)
        
        buffer = io.BytesIO()
        pdf.output(buffer)
        buffer.seek(0)
        
        filename = f"Contract_{data.get('contract_number', datetime.datetime.now().strftime('%Y%m%d'))}.pdf"
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename,
            max_age=-1
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
