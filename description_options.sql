-- Create description_options table to store evaluation descriptions
CREATE TABLE description_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(20) NOT NULL, -- 'Rendah', 'Kurang', 'Cukup', 'Baik', 'Tinggi'
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_description_options_updated_at
    BEFORE UPDATE ON description_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert descriptions for 'Rendah' category
INSERT INTO description_options (category, description) VALUES
('Rendah', 'Menunjukkan kemampuan yang masih perlu banyak pengembangan'),
('Rendah', 'Berada di bawah standar yang diharapkan'),
('Rendah', 'Memerlukan peningkatan yang signifikan');

-- Insert descriptions for 'Kurang' category
INSERT INTO description_options (category, description) VALUES
('Kurang', 'Belum mencapai tingkat yang diharapkan'),
('Kurang', 'Masih memerlukan pengembangan lebih lanjut'),
('Kurang', 'Perlu ditingkatkan untuk mencapai standar');

-- Insert descriptions for 'Cukup' category
INSERT INTO description_options (category, description) VALUES
('Cukup', 'Memenuhi standar minimal yang diharapkan'),
('Cukup', 'Berada pada tingkat yang memadai'),
('Cukup', 'Menunjukkan kemampuan yang cukup baik');

-- Insert descriptions for 'Baik' category
INSERT INTO description_options (category, description) VALUES
('Baik', 'Menunjukkan kemampuan di atas rata-rata'),
('Baik', 'Memiliki keterampilan yang mumpuni'),
('Baik', 'Mampu menyelesaikan tugas dengan baik');

-- Insert descriptions for 'Tinggi' category
INSERT INTO description_options (category, description) VALUES
('Tinggi', 'Menunjukkan keunggulan yang signifikan'),
('Tinggi', 'Memiliki kemampuan yang sangat baik'),
('Tinggi', 'Berada pada level yang superior');

-- Example query to get a random description for a specific category
-- SELECT description FROM description_options WHERE category = 'Rendah' ORDER BY RANDOM() LIMIT 1;