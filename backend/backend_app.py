from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres%40ashutosh@localhost/asikh_rent'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ---------------- Models ---------------- #

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Tenant(db.Model):
    __tablename__ = 'tenants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    rent_amount = db.Column(db.Numeric)

class RentPayment(db.Model):
    __tablename__ = 'rent_payments'
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date_paid = db.Column(db.Date, nullable=False)

    tenant = db.relationship('Tenant', backref='payments')


# ---------------- Routes ---------------- #

# Register
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing data'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 400

    user = User(username=data['username'])
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})


# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


# Rent History API
@app.route('/rent-history', methods=['GET'])
def rent_history():
    payments = RentPayment.query.all()
    result = []

    for payment in payments:
        result.append({
            'tenant_name': payment.tenant.name,
            'amount': float(payment.amount),
            'date_paid': payment.date_paid.strftime('%Y-%m-%d')
        })

    return jsonify(result)


# Get all tenants
@app.route('/tenants', methods=['GET'])
def get_tenants():
    tenants = Tenant.query.all()
    return jsonify([{'id': t.id, 'name': t.name} for t in tenants])


# Add a rent payment
@app.route('/add-rent', methods=['POST'])
def add_rent():
    data = request.get_json()
    tenant_id = data.get('tenant_id')
    amount = data.get('amount')
    date_paid = data.get('date_paid')

    if not tenant_id or not amount or not date_paid:
        return jsonify({'message': 'Missing data'}), 400

    try:
        payment = RentPayment(
            tenant_id=tenant_id,
            amount=amount,
            date_paid=datetime.strptime(date_paid, '%Y-%m-%d')
        )
        db.session.add(payment)
        db.session.commit()
        return jsonify({'message': 'Payment added successfully'})
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# ---------------- Init DB & Default Admin ---------------- #

with app.app_context():
    db.create_all()  # Creates tables if they don't exist

    # Create a default admin user if not already created
    if not User.query.filter_by(username='admin').first():
        user = User(username='admin')
        user.set_password('admin123')
        db.session.add(user)
        db.session.commit()

        # ---------------- Tenant Status API ---------------- #

@app.route('/tenant-status', methods=['GET'])
def tenant_status():
    tenants = Tenant.query.all()
    current_month = datetime.now().strftime('%Y-%m')

    result = []
    for tenant in tenants:
        has_paid = any(
            payment.date_paid.strftime('%Y-%m') == current_month
            for payment in tenant.payments
        )
        result.append({
            'tenant_name': tenant.name,
            'rent_amount': float(tenant.rent_amount),
            'status': 'Paid' if has_paid else 'Pending'
        })

    return jsonify(result)

# @app.route('/tenants', methods=['GET'])
# def get_tenants():
#     tenants = Tenant.query.all()
#     result = [{'id': t.id, 'name': t.name} for t in tenants]
#     return jsonify(result)



# ---------------- Run the App ---------------- #

if __name__ == '__main__':
    app.run(debug=True)
