from app.extensions import db

from datetime import datetime

class Parcel(db.Model):
    __tablename__ = 'parcels'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    origin = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    present_location = db.Column(db.String(255), nullable=True)
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id'), nullable=False)
    
    is_deleted = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    status = db.relationship('Status', back_populates='parcels')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "origin": self.origin,
            "destination": self.destination,
            "present_location": self.present_location,
            "status": self.status.name if self.status else None,
            "is_deleted": self.is_deleted,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

