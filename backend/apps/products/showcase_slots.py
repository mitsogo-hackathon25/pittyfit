SHOWCASE_SLOTS = [
    ('model_0', 'model', 'Front View'),
    ('model_1', 'model', 'Right Side View'),
    ('model_2', 'model', 'Back View'),
    ('model_3', 'model', 'Left Side View'),
    ('detail_0', 'detail', 'Front Detail'),
    ('detail_1', 'detail', 'Back Detail'),
    ('detail_2', 'detail', 'Product Detail'),
    ('flat_0', 'flat', 'Front'),
    ('flat_1', 'flat', 'Back'),
    ('flat_2', 'flat', 'Side'),
    ('flat_3', 'flat', 'Detail'),
    ('flat_4', 'flat', 'Alternate'),
    ('macro_0', 'macro', 'Premium Fabric'),
    ('macro_1', 'macro', 'Flatlock Stitching'),
]

SHOWCASE_SLOT_KEYS = [slot[0] for slot in SHOWCASE_SLOTS]
SHOWCASE_SLOT_CHOICES = [(key, label) for key, _section, label in SHOWCASE_SLOTS]
