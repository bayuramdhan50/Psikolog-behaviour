-- Create personal_info table
CREATE TABLE personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    no_tes VARCHAR(20) UNIQUE NOT NULL,
    nama_peserta VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    nama_pt VARCHAR(100),
    sdr_sdri VARCHAR(10) NOT NULL,
    jenis_kelamin VARCHAR(20) NOT NULL,
    tanggal_tes DATE NOT NULL,
    phq INTEGER,
    keterangan_phq TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ist table with foreign key reference to personal_info
CREATE TABLE ist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE UNIQUE,
    se_konkrit_praktis INTEGER NOT NULL,
    wa_verbal INTEGER NOT NULL,
    an_fleksibilitas_pikir INTEGER NOT NULL,
    ge_daya_abstraksi_verbal INTEGER NOT NULL,
    ra_berpikir_praktis INTEGER NOT NULL,
    iq INTEGER NOT NULL,
    iq_classification VARCHAR(50) NOT NULL,
    wa_ge INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create papikostick table with foreign key reference to personal_info
CREATE TABLE papikostick (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_info_id UUID REFERENCES personal_info(id) ON DELETE CASCADE UNIQUE,
    n INTEGER NOT NULL,
    g INTEGER NOT NULL,
    a INTEGER NOT NULL,
    l INTEGER NOT NULL,
    p INTEGER NOT NULL,
    i INTEGER NOT NULL,
    t INTEGER NOT NULL,
    v INTEGER NOT NULL,
    s INTEGER NOT NULL,
    b INTEGER NOT NULL,
    o INTEGER NOT NULL,
    x INTEGER NOT NULL,
    c INTEGER NOT NULL,
    d INTEGER NOT NULL,
    r INTEGER NOT NULL,
    z INTEGER NOT NULL,
    e INTEGER NOT NULL,
    k INTEGER NOT NULL,
    f INTEGER NOT NULL,
    w INTEGER NOT NULL,
    ng INTEGER NOT NULL,
    cdr INTEGER NOT NULL,
    tv INTEGER NOT NULL,
    pi INTEGER NOT NULL,
    bs INTEGER NOT NULL,
    zk INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
CREATE TRIGGER update_personal_info_updated_at
    BEFORE UPDATE ON personal_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ist_updated_at
    BEFORE UPDATE ON ist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_papikostick_updated_at
    BEFORE UPDATE ON papikostick
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();