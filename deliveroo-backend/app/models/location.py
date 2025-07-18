from . import db

class Location(db.Model):
    __tablename__ = "locations"

    id = db.Column(db.Integer, primary_key=True)
    current_location = db.Column(db.String, nullable=True)

    parcels = db.relationship("Parcel", back_populates="location")


    def set_password(self, password):
        self.current_location = password  

    def check_password(self, password):
        return self.current_location == password

    def __repr__(self):
        return f"<Location {self.id} - {self.current_location}>"
