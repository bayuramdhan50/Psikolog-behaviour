-- Create description_options table to store evaluation descriptions
CREATE TABLE description_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tingkat_evaluasi VARCHAR(50) NOT NULL, -- 'Rendah', 'Kurang', 'Cukup', 'Baik', 'Tinggi'
    kompetensi TEXT NOT NULL,
    deskripsi_1 TEXT NOT NULL,
    deskripsi_2 TEXT NOT NULL,
    deskripsi_3 TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_description_options_updated_at
    BEFORE UPDATE ON description_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert descriptions for 'Rendah' category
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Logika Berpikir', 'menunjukkan kesulitan dalam mengidentifikasi pola logis, yang mengindikasikan kemampuan penalaran induktif yang terbatas.', 'kemampuan deduktif individu terhambat, terlihat dari kesulitan dalam menarik kesimpulan yang valid dari premis yang diberikan.', 'proses pemecahan masalah individu cenderung tidak sistematis, menunjukkan kurangnya kemampuan untuk menerapkan langkah-langkah logis secara berurutan.');

-- Insert descriptions for 'Kurang' category
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Logika Berpikir', 'menunjukkan kesulitan dalam mempertahankan konsistensi logis dalam argumennya, terkadang membuat kesimpulan yang tidak sepenuhnya didukung oleh bukti.', 'kemampuan untuk menganalisis informasi kompleks secara logis masih terbatas, terlihat dari kesulitan dalam mengidentifikasi hubungan sebab-akibat yang rumit.', 'cenderung kesulitan dalam membedakan antara fakta dan opini, yang mengindikasikan kurangnya kemampuan berpikir kritis yang tajam.');

-- Insert descriptions for 'Cukup' category
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Logika Berpikir', 'mampu menerapkan prinsip-prinsip logika dasar dalam pemecahan masalah, meskipun terkadang membutuhkan waktu untuk mencapai kesimpulan yang tepat.', 'kemampuan untuk mengevaluasi argumen secara logis cukup memadai, meskipun ada ruang untuk peningkatan dalam mengidentifikasi bias dan asumsi tersembunyi.', 'mampu mengikuti alur penalaran yang logis dalam diskusi dan presentasi, menunjukkan kemampuan untuk berkomunikasi secara efektif.');

-- Insert descriptions for 'Baik' category
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Logika Berpikir', 'menunjukkan kemampuan yang kuat dalam mengidentifikasi dan menerapkan pola logis dalam berbagai konteks, menunjukkan kemampuan penalaran yang tinggi.', 'kemampuan untuk menganalisis informasi kompleks secara logis sangat baik, terlihat dari kemampuan untuk mengidentifikasi hubungan yang rumit dan menarik kesimpulan yang akurat.', 'mampu berpikir kritis secara efektif, mampu mengevaluasi argumen dengan cermat dan mengidentifikasi kelemahan dalam penalaran.');

-- Insert descriptions for 'Tinggi' category
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Logika Berpikir', 'menunjukkan kemampuan luar biasa dalam menerapkan prinsip-prinsip logika tingkat lanjut, mampu memecahkan masalah yang kompleks dengan mudah.', 'kemampuan untuk berpikir abstrak dan konseptual sangat tinggi, memungkinkan individu untuk memahami dan memanipulasi ide-ide yang kompleks dengan mudah.', 'memiliki kemampuan untuk mengidentifikasi dan memperbaiki kesalahan logika dalam argumen orang lain, menunjukkan kemampuan berpikir kritis yang tajam dan analitis.');

-- Insert descriptions for 'Daya Analisa' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Daya Analisa', 'Ybs menunjukkan kesulitan dalam mengidentifikasi komponen-komponen penting dari suatu masalah, sehingga pemahaman terhadap hubungan sebab-akibat menjadi terbatas.', 'Kemampuan untuk memecah permasalahan kompleks menjadi bagian-bagian yang lebih kecil sangat kurang, yang menyebabkan kesulitan dalam menemukan solusi yang efektif.', 'Ybs cenderung kesulitan dalam mengevaluasi informasi yang relevan, sehingga pengambilan keputusan seringkali didasarkan pada asumsi yang tidak tepat.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Daya Analisa', 'Ybs menunjukkan keterbatasan dalam mengidentifikasi pola-pola yang mendasari suatu permasalahan, sehingga pemahaman terhadap dinamika masalah kurang mendalam.', 'Kemampuan untuk mengidentifikasi hubungan sebab-akibat masih berkembang, terkadang individu melewatkan faktor-faktor penting yang mempengaruhi suatu situasi.', 'Ybs cenderung mengalami kesulitan dalam memprioritaskan informasi yang relevan, sehingga analisa yang dilakukan kurang fokus dan efisien.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Daya Analisa', 'Ybs mampu mengidentifikasi komponen-komponen utama dari suatu permasalahan dan memahami hubungan dasar antara faktor-faktor tersebut.', 'Kemampuan untuk menganalisis informasi secara sistematis cukup memadai, meskipun terkadang individu membutuhkan waktu untuk mencapai kesimpulan yang tepat.', 'Ybs mampu mengevaluasi informasi yang relevan dengan cukup baik, meskipun ada ruang untuk peningkatan dalam mengidentifikasi bias dan asumsi tersembunyi.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Daya Analisa', 'Ybs menunjukkan kemampuan yang baik dalam mengidentifikasi pola-pola yang kompleks dan memahami hubungan sebab-akibat yang mendalam.', 'Kemampuan untuk memecah permasalahan kompleks menjadi bagian-bagian yang lebih kecil sangat baik, memungkinkan individu untuk menemukan solusi yang efektif dan efisien.', 'Ybs mampu mengevaluasi informasi yang relevan dengan cermat, mampu mengidentifikasi bias dan asumsi tersembunyi, serta membuat keputusan yang tepat.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Daya Analisa', 'Ybs menunjukkan kemampuan yang sangat tinggi dalam mengidentifikasi pola-pola yang abstrak dan memahami hubungan sebab-akibat yang sangat kompleks.', 'Kemampuan untuk menganalisis informasi yang kompleks secara mendalam sangat baik, memungkinkan individu untuk mengidentifikasi solusi yang inovatif dan kreatif.', 'Ybs memiliki kemampuan untuk memprediksi konsekuensi dari berbagai tindakan, menunjukkan kemampuan analitis yang tajam dan kemampuan untuk berpikir jauh ke depan.');

-- Insert descriptions for 'Kemampuan Numerikal' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Kemampuan Numerikal', 'Selain itu, menunjukkan kesulitan yang signifikan dalam memahami konsep dasar matematika seperti persentase dan rasio.', 'Selain itu, kemampuan untuk melakukan perhitungan aritmatika sederhana seperti penjumlahan dan pengurangan juga terbatas, yang menyebabkan seringnya terjadi kesalahan.', 'Selain itu, kesulitan dalam menginterpretasikan data numerik dalam bentuk grafik atau tabel, menunjukkan pemahaman yang lemah terhadap informasi kuantitatif.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Kemampuan Numerikal', 'Selain itu, menunjukkan pemahaman yang kurang memadai terhadap konsep matematika dasar, yang mempengaruhi kemampuan mereka dalam menyelesaikan masalah numerik.', 'Selain itu, kemampuan untuk melakukan perhitungan aritmatika cukup lambat dan kurang akurat, terutama dalam situasi yang membutuhkan kecepatan dan ketelitian.', 'Selain itu, cenderung kesulitan dalam menerapkan konsep matematika untuk memecahkan masalah praktis, menunjukkan keterbatasan dalam penalaran numerik.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Kemampuan Numerikal', 'Selain itu, memiliki pemahaman yang cukup baik terhadap konsep matematika dasar dan mampu melakukan perhitungan aritmatika dengan cukup akurat.', 'Selain itu, kemampuan untuk menginterpretasikan data numerik dalam bentuk grafik atau tabel cukup memadai, meskipun ada ruang untuk peningkatan.', 'Selain itu, mampu menerapkan konsep matematika untuk memecahkan masalah praktis dalam situasi yang relatif sederhana.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Kemampuan Numerikal', 'Selain itu, menunjukkan pemahaman yang baik terhadap konsep matematika dan mampu melakukan perhitungan aritmatika dengan cepat dan akurat.', 'Selain itu, kemampuan untuk menginterpretasikan data numerik dalam berbagai bentuk sangat baik, menunjukkan pemahaman yang kuat terhadap informasi kuantitatif.', 'Selain itu, mampu menerapkan konsep matematika untuk memecahkan masalah praktis yang kompleks dengan efektif.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Kemampuan Numerikal', 'Selain itu, memiliki pemahaman yang mendalam terhadap konsep matematika tingkat lanjut dan mampu melakukan perhitungan aritmatika yang kompleks dengan sangat cepat dan akurat.', 'Selain itu, kemampuan untuk menganalisis dan menginterpretasikan data numerik yang kompleks sangat luar biasa, menunjukkan kemampuan penalaran kuantitatif yang sangat tinggi.', 'Selain itu, mampu mengembangkan solusi kreatif untuk masalah praktis yang kompleks dengan menggunakan konsep matematika tingkat lanjut.');

-- Insert descriptions for 'Kemampuan Verbal' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Kemampuan Verbal', 'Kemudian, menunjukkan kesulitan dalam memahami instruksi verbal yang kompleks, seringkali memerlukan penjelasan yang berulang.', 'Kemudian, keterbatasan dalam kosa kata terlihat dari kesulitan dalam mengekspresikan ide-ide secara jelas dan tepat.', 'Kemudian, kemampuan untuk mengidentifikasi hubungan antara kata-kata, seperti analogi dan sinonim, sangat terbatas.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Kemampuan Verbal', 'Kemudian, menunjukkan pemahaman yang kurang memadai terhadap nuansa makna dalam bahasa, yang mempengaruhi kemampuan mereka dalam berkomunikasi secara efektif.', 'Kemudian, kemampuan untuk menyampaikan gagasan secara lisan atau tertulis kurang lancar, terkadang terjadi pengulangan atau ketidakjelasan.', 'Kemudian, cenderung kesulitan dalam memahami teks yang kompleks atau abstrak, menunjukkan keterbatasan dalam pemahaman bacaan.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Kemampuan Verbal', 'Kemudian, memiliki pemahaman yang cukup baik terhadap kosa kata umum dan mampu mengikuti instruksi verbal dengan cukup baik.', 'Kemudian, kemampuan untuk mengekspresikan diri secara lisan dan tertulis cukup memadai, meskipun ada ruang untuk peningkatan dalam kefasihan dan ketepatan.', 'Kemudian, mampu memahami teks yang relatif kompleks, meskipun terkadang membutuhkan waktu untuk memahami nuansa makna yang lebih dalam.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Kemampuan Verbal', 'Kemudian, menunjukkan pemahaman yang baik terhadap kosa kata yang luas dan mampu memahami nuansa makna dalam bahasa.', 'Kemudian, kemampuan untuk menyampaikan gagasan secara lisan dan tertulis sangat baik, menunjukkan kefasihan dan ketepatan dalam berkomunikasi.', 'Kemudian, mampu memahami teks yang kompleks dan abstrak dengan mudah, menunjukkan pemahaman bacaan yang kuat.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Kemampuan Verbal', 'Kemudian, memiliki penguasaan yang sangat baik terhadap kosa kata yang luas dan kompleks, mampu memahami dan menggunakan bahasa dengan sangat presisi.', 'Kemudian, kemampuan untuk mengekspresikan diri secara lisan dan tertulis sangat luar biasa, menunjukkan kefasihan, ketepatan, dan gaya bahasa yang kaya.', 'Kemudian, mampu memahami dan menganalisis teks yang sangat kompleks dan abstrak dengan mudah, menunjukkan pemahaman bacaan yang mendalam dan kritis.');

-- Insert descriptions for 'Orientasi Hasil' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Orientasi Hasil', 'menunjukkan kesulitan dalam mempertahankan fokus pada penyelesaian tugas, seringkali teralihkan oleh gangguan eksternal.', 'kemampuan untuk menghubungkan perencanaan dengan hasil kerja sangat terbatas, yang menyebabkan seringnya terjadi ketidaksesuaian antara target dan pencapaian.', 'cenderung kurang bertanggung jawab dalam menyelesaikan tugas, seringkali menunda-nunda atau menghindari tanggung jawab.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Orientasi Hasil', 'menunjukkan upaya yang kurang maksimal dalam menyelesaikan tugas, terkadang mengabaikan detail-detail penting yang mempengaruhi hasil akhir.', 'kemampuan untuk mengantisipasi hambatan dan merencanakan solusi alternatif masih berkembang, yang menyebabkan kesulitan dalam mencapai target yang ditetapkan.', 'cenderung kurang proaktif dalam mencari cara untuk meningkatkan efisiensi dan efektivitas kerja.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Orientasi Hasil', 'mampu menyelesaikan tugas-tugas yang diberikan dengan cukup baik, meskipun terkadang membutuhkan pengawasan tambahan.', 'kemampuan untuk mengikuti rencana kerja dan mencapai target yang ditetapkan cukup memadai, meskipun ada ruang untuk peningkatan dalam ketepatan waktu.', 'cukup bertanggung jawab dalam menyelesaikan tugas-tugas yang diberikan, meskipun terkadang kurang inisiatif dalam mencari cara untuk meningkatkan hasil kerja.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Orientasi Hasil', 'menunjukkan komitmen yang kuat dalam menyelesaikan tugas-tugas yang diberikan, selalu berusaha untuk mencapai hasil yang terbaik.', 'kemampuan untuk mengantisipasi hambatan dan merencanakan solusi alternatif sangat baik, memungkinkan individu untuk mencapai target yang ditetapkan dengan efisien.', 'proaktif dalam mencari cara untuk meningkatkan efisiensi dan efektivitas kerja, selalu berusaha untuk mencapai hasil yang optimal.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Orientasi Hasil', 'memiliki dorongan yang sangat kuat untuk mencapai hasil yang luar biasa, selalu melampaui ekspektasi dalam menyelesaikan tugas-tugas yang diberikan.', 'kemampuan untuk merencanakan dan melaksanakan proyek-proyek kompleks sangat luar biasa, menunjukkan kemampuan untuk mengelola waktu dan sumber daya dengan sangat efektif.', 'memiliki kemampuan untuk mengidentifikasi peluang untuk perbaikan dan inovasi, selalu berusaha untuk meningkatkan kualitas hasil kerja.');

-- Insert descriptions for 'Motivasi Berprestasi' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Motivasi Berprestasi', 'menunjukkan kurangnya dorongan untuk mencapai target yang ditetapkan, seringkali merasa puas dengan hasil yang minimal.', 'kemampuan untuk menetapkan tujuan yang menantang dan realistis sangat terbatas, yang menyebabkan kurangnya arah dalam pencapaian prestasi.', 'cenderung menghindari tantangan dan risiko, yang menghambat perkembangan potensi dan pencapaian prestasi yang lebih tinggi.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Motivasi Berprestasi', 'menunjukkan upaya yang kurang maksimal dalam mencapai target, terkadang kehilangan fokus dan motivasi di tengah jalan.', 'kemampuan untuk mengelola waktu dan sumber daya dalam mencapai target masih berkembang, yang menyebabkan kesulitan dalam mencapai hasil yang optimal.', 'cenderung kurang percaya diri dalam menghadapi tantangan, yang mempengaruhi motivasi untuk mencapai prestasi yang lebih tinggi.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Motivasi Berprestasi', 'mampu mencapai target yang ditetapkan dengan cukup baik, meskipun terkadang membutuhkan dorongan tambahan.', 'kemampuan untuk mengelola waktu dan sumber daya dalam mencapai target cukup memadai, meskipun ada ruang untuk peningkatan dalam efisiensi.', 'cukup percaya diri dalam menghadapi tantangan, meskipun terkadang masih merasa ragu untuk mengambil risiko yang lebih besar.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Motivasi Berprestasi', 'menunjukkan dorongan yang kuat untuk mencapai target yang ditetapkan, selalu berusaha untuk melampaui ekspektasi.', 'kemampuan untuk mengelola waktu dan sumber daya dalam mencapai target sangat baik, mampu mencapai hasil yang optimal dengan efisien.', 'sangat percaya diri dalam menghadapi tantangan, berani mengambil risiko yang terukur untuk mencapai prestasi yang lebih tinggi.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Motivasi Berprestasi', 'memiliki dorongan yang sangat kuat untuk mencapai prestasi yang luar biasa, selalu menetapkan target yang sangat tinggi dan menantang', 'kemampuan untuk mengelola waktu dan sumber daya dalam mencapai target sangat luar biasa, mampu mencapai hasil yang melampaui ekspektasi dengan sangat efisien.', 'memiliki keyakinan yang sangat kuat dalam menghadapi tantangan, selalu mencari peluang untuk mencapai prestasi yang lebih tinggi dan memberikan dampak yang signifikan.');

-- Insert descriptions for 'Fleksibilitas' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Fleksibilitas', 'Ybs menunjukkan kesulitan dalam beradaptasi dengan perubahan situasi, cenderung kaku dalam menghadapi hal-hal baru.', 'Kemampuan untuk mengubah strategi ketika menghadapi hambatan sangat terbatas, seringkali berujung pada kebuntuan.', 'Ybs cenderung menolak perubahan dan mempertahankan rutinitas yang sudah ada, bahkan ketika situasi menuntut penyesuaian.');

-- Insert descriptions for 'Stabilitas Emosi' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Stabilitas Emosi', 'Selain itu juga, menunjukkan fluktuasi emosi yang signifikan, seringkali bereaksi berlebihan terhadap situasi yang menekan.', 'Selain itu juga, kemampuan untuk mengelola stres dan tekanan sangat terbatas, yang menyebabkan seringnya terjadi ledakan emosi.', 'Selain itu juga, cenderung kesulitan dalam mengidentifikasi dan memahami pemicu emosi negatif, yang menyebabkan kesulitan dalam mengendalikan diri.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Stabilitas Emosi', 'Selain itu juga, menunjukkan upaya yang kurang maksimal dalam mengendalikan emosi, terkadang mengalami kesulitan dalam menghadapi situasi yang sulit.', 'Selain itu juga, Kemampuan untuk mengatur emosi masih berkembang, yang menyebabkan terkadang terjadi reaksi emosional yang tidak proporsional.', 'Selain itu juga, cenderung kurang mampu mengelola emosi dalam situasi yang menantang, yang mempengaruhi kemampuan mereka untuk mengambil keputusan yang rasional.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Stabilitas Emosi', 'Selain itu juga, mampu mengendalikan emosi dengan cukup baik dalam situasi yang relatif stabil, meskipun terkadang membutuhkan waktu untuk beradaptasi dengan perubahan.', 'Selain itu juga, kemampuan untuk mengelola stres dan tekanan cukup memadai, meskipun ada ruang untuk peningkatan dalam fleksibilitas emosional.', 'Selain itu juga, cukup mampu memahami dan mengidentifikasi pemicu emosi, meskipun terkadang kurang mampu mengantisipasi reaksi emosional yang mungkin timbul.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Stabilitas Emosi', 'Selain itu juga, menunjukkan kemampuan yang baik dalam mengendalikan emosi, mampu menjaga ketenangan dalam situasi yang menekan.', 'Selain itu juga, kemampuan untuk mengelola stres dan tekanan sangat baik, mampu beradaptasi dengan perubahan situasi dengan cepat dan efektif.', 'Selain itu juga, sangat mampu memahami dan mengidentifikasi pemicu emosi, mampu mengantisipasi dan mengelola reaksi emosional dengan baik.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Stabilitas Emosi', 'Selain itu juga, memiliki kemampuan yang sangat tinggi dalam mengendalikan emosi, mampu menjaga keseimbangan emosional dalam situasi yang sangat menekan.', 'Selain itu juga, kemampuan untuk mengelola stres dan tekanan sangat luar biasa, mampu mengubah tantangan menjadi peluang untuk pertumbuhan pribadi.', 'Selain itu juga, memiliki pemahaman yang mendalam tentang emosi, mampu mengelola emosi dengan sangat efektif dan membangun hubungan yang harmonis dengan orang lain.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Fleksibilitas', 'Ybs menunjukkan upaya yang kurang maksimal dalam menyesuaikan diri dengan perubahan, terkadang merasa tidak nyaman dengan hal-hal baru.', 'Kemampuan untuk mengubah pendekatan dalam menghadapi masalah masih berkembang, terkadang memerlukan bantuan untuk beradaptasi.', 'Ybs cenderung kurang terbuka terhadap ide-ide baru atau cara kerja yang berbeda.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Fleksibilitas', 'Ybs mampu menyesuaikan diri dengan perubahan situasi dengan cukup baik, meskipun terkadang membutuhkan waktu untuk beradaptasi', 'Kemampuan untuk mengubah pendekatan dalam menghadapi masalah cukup memadai, meskipun ada ruang untuk peningkatan dalam kecepatan adaptasi.', 'Ybs cukup terbuka terhadap ide-ide baru atau cara kerja yang berbeda, meskipun terkadang masih merasa ragu.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Fleksibilitas', 'Ybs menunjukkan kemampuan yang baik dalam beradaptasi dengan perubahan situasi, mampu dengan cepat menyesuaikan diri dengan hal-hal baru.', 'Kemampuan untuk mengubah pendekatan dalam menghadapi masalah sangat baik, mampu dengan mudah menemukan solusi alternatif.', 'Ybs sangat terbuka terhadap ide-ide baru atau cara kerja yang berbeda, bahkan cenderung mencari inovasi.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Fleksibilitas', 'Ybs memiliki kemampuan yang sangat tinggi dalam beradaptasi dengan perubahan situasi, mampu dengan cepat dan efektif menyesuaikan diri dengan hal-hal baru.', 'Kemampuan untuk mengubah pendekatan dalam menghadapi masalah sangat luar biasa, mampu dengan mudah mengembangkan strategi-strategi inovatif.', 'Ybs sangat antusias terhadap ide-ide baru atau cara kerja yang berbeda, bahkan cenderung menjadi pelopor perubahan.');

-- Insert descriptions for 'Pengembangan Diri' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Pengembangan Diri', 'menunjukkan kurangnya inisiatif dalam mencari peluang untuk meningkatkan pengetahuan dan keterampilan diri.', 'kemampuan untuk menerima umpan balik konstruktif dan menggunakannya untuk perbaikan diri sangat terbatas.', 'cenderung menghindari tantangan dan perubahan, yang menghambat proses pengembangan diri.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Pengembangan Diri', 'menunjukkan upaya yang kurang maksimal dalam mengembangkan diri, terkadang kurang konsisten dalam mengikuti program pelatihan atau pengembangan', 'kemampuan untuk mengidentifikasi area yang perlu ditingkatkan masih berkembang, yang menyebabkan kesulitan dalam menetapkan tujuan pengembangan diri yang spesifik.', 'cenderung kurang proaktif dalam mencari sumber daya atau dukungan untuk pengembangan diri.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Pengembangan Diri', 'mampu mengikuti program pelatihan atau pengembangan diri dengan cukup baik, meskipun terkadang membutuhkan dorongan tambahan.', 'kemampuan untuk mengidentifikasi area yang perlu ditingkatkan cukup memadai, meskipun ada ruang untuk peningkatan dalam kesadaran diri.', 'cukup terbuka terhadap umpan balik dan bersedia untuk mencoba hal-hal baru, meskipun terkadang masih merasa ragu.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Pengembangan Diri', 'menunjukkan inisiatif yang kuat dalam mencari peluang untuk mengembangkan diri, selalu berusaha untuk meningkatkan pengetahuan dan keterampilan.', 'kemampuan untuk menerima dan mengolah umpan balik konstruktif sangat baik, mampu menggunakannya untuk perbaikan diri yang berkelanjutan.', 'sangat proaktif dalam mencari sumber daya dan dukungan untuk pengembangan diri, mampu menciptakan rencana pengembangan diri yang efektif.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Pengembangan Diri', 'memiliki dorongan yang sangat kuat untuk mengembangkan diri, selalu mencari tantangan dan peluang untuk pertumbuhan pribadi.', 'kemampuan untuk mengidentifikasi dan menganalisis kebutuhan pengembangan diri sangat luar biasa, mampu menciptakan rencana pengembangan diri yang komprehensif dan strategis.', 'memiliki kemampuan yang luar biasa dalam belajar mandiri dan beradaptasi dengan perubahan, mampu mencapai tingkat penguasaan yang tinggi dalam berbagai bidang.');

-- Insert descriptions for 'Mengelola Perubahan' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Mengelola Perubahan', 'serta menunjukkan resistensi yang kuat terhadap perubahan, seringkali merasa tidak nyaman dan tertekan dalam situasi baru.', 'serta untuk beradaptasi dengan perubahan lingkungan kerja atau tugas sangat terbatas, yang menyebabkan seringnya terjadi disorientasi.', 'serta cenderung kesulitan dalam melepaskan rutinitas lama dan menerima cara kerja yang baru.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Mengelola Perubahan', 'serta untuk mengubah pola pikir dan perilaku dalam menghadapi perubahan masih berkembang, yang menyebabkan terkadang terjadi kesulitan dalam beradaptasi.', 'serta menunjukkan upaya yang kurang maksimal dalam menyesuaikan diri dengan perubahan, terkadang merasa cemas dan tidak yakin dalam menghadapi situasi baru.', 'serta cenderung membutuhkan waktu yang lebih lama untuk beradaptasi dengan perubahan, dan membutuhkan dukungan tambahan.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Mengelola Perubahan', 'serta mampu menyesuaikan diri dengan perubahan situasi dengan cukup baik, meskipun terkadang membutuhkan waktu untuk beradaptasi.', 'serta untuk menerima dan mengimplementasikan perubahan cukup memadai, meskipun ada ruang untuk peningkatan dalam fleksibilitas.', 'serta cukup mampu mengatasi ketidakpastian yang timbul akibat perubahan, meskipun terkadang merasa sedikit tidak nyaman.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Mengelola Perubahan', 'serta menunjukkan kemampuan yang baik dalam beradaptasi dengan perubahan, mampu dengan cepat menyesuaikan diri dengan situasi baru.', 'serta untuk melihat perubahan sebagai peluang untuk pertumbuhan dan perkembangan sangat baik, mampu mengambil inisiatif dalam menghadapi perubahan.', 'serta sangat mampu mengelola ketidakpastian dan stres yang timbul akibat perubahan, mampu menjaga keseimbangan emosional.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Mengelola Perubahan', 'serta memiliki kemampuan yang sangat tinggi dalam mengelola perubahan, mampu memimpin dan menginspirasi orang lain untuk beradaptasi dengan situasi baru.', 'serta untuk melihat perubahan sebagai peluang untuk inovasi dan perbaikan sangat luar biasa, mampu menciptakan solusi kreatif dalam menghadapi perubahan.', 'serta memiliki ketahanan yang sangat tinggi dalam menghadapi perubahan, mampu mengubah tantangan menjadi peluang untuk sukses.');

-- Insert descriptions for 'Kerjasama' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Kerjasama', 'Tak hanya itu, ybs juga menunjukkan kesulitan dalam berpartisipasi dalam kerja kelompok, seringkali lebih memilih untuk bekerja sendiri.', 'Tak hanya itu, ybs juga berkomunikasi dan berkoordinasi dengan anggota tim sangat terbatas, yang menyebabkan seringnya terjadi kesalahpahaman.', 'Tak hanya itu, ybs juga cenderung kurang peduli terhadap tujuan bersama, lebih fokus pada kepentingan pribadi.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Kerjasama', 'Tak hanya itu, ybs juga menunjukkan upaya yang kurang maksimal dalam berkontribusi pada kerja kelompok, terkadang mengabaikan tanggung jawab yang diberikan.', 'Tak hanya itu, ybs juga mendengarkan dan menghargai pendapat orang lain masih berkembang, yang menyebabkan kesulitan dalam membangun hubungan kerja yang efektif.', 'Tak hanya itu, ybs juga cenderung kurang proaktif dalam mencari cara untuk meningkatkan sinergi dalam tim.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Kerjasama', 'Tak hanya itu, ybs juga mampu berpartisipasi dalam kerja kelompok dengan cukup baik, meskipun terkadang membutuhkan arahan tambahan.', 'Tak hanya itu, ybs juga berkomunikasi dan berkoordinasi dengan anggota tim cukup memadai, meskipun ada ruang untuk peningkatan dalam efektivitas.', 'Tak hanya itu, ybs juga cukup peduli terhadap tujuan bersama, meskipun terkadang kurang inisiatif dalam mencari cara untuk mencapainya.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Kerjasama', 'Tak hanya itu, ybs juga menunjukkan kemampuan yang baik dalam berkolaborasi dengan anggota tim, selalu berusaha untuk memberikan kontribusi yang positif.', 'Tak hanya itu, ybs juga berkomunikasi dan berkoordinasi dengan anggota tim sangat baik, mampu membangun hubungan kerja yang harmonis dan produktif.', 'Tak hanya itu, ybs juga sangat peduli terhadap tujuan bersama, aktif mencari cara untuk meningkatkan sinergi dan mencapai hasil yang optimal.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Kerjasama', 'Tak hanya itu, ybs juga memiliki kemampuan yang sangat tinggi dalam membangun dan memimpin tim yang efektif, mampu menginspirasi dan memotivasi anggota tim untuk mencapai tujuan bersama.', 'Tak hanya itu, ybs juga berkomunikasi dan berkoordinasi dengan anggota tim sangat luar biasa, mampu menciptakan lingkungan kerja yang kolaboratif dan inklusif.', 'Tak hanya itu, ybs juga memiliki komitmen yang sangat kuat terhadap tujuan bersama, selalu berusaha untuk menciptakan sinergi dan mencapai hasil yang melampaui ekspektasi.');

-- Insert descriptions for 'Keterampilan Interpersonal' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Keterampilan Interpersonal', 'Ybs menunjukkan kesulitan dalam memahami dan merespons emosi orang lain, yang menyebabkan seringnya terjadi kesalahpahaman dalam interaksi sosial.', 'Kemampuan untuk membangun dan mempertahankan hubungan sosial yang positif sangat terbatas, yang menyebabkan isolasi sosial.', 'Ybs cenderung kurang peka terhadap kebutuhan dan perasaan orang lain, yang menyebabkan kesulitan dalam bekerja sama dan membangun kepercayaan.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Keterampilan Interpersonal', 'Ybs menunjukkan upaya yang kurang maksimal dalam membangun hubungan sosial yang efektif, terkadang mengalami kesulitan dalam berkomunikasi secara asertif.', 'Kemampuan untuk mendengarkan secara aktif dan memberikan umpan balik yang konstruktif masih berkembang, yang menyebabkan kesulitan dalam membangun hubungan yang saling mendukung.', 'Ybs cenderung kurang fleksibel dalam menghadapi perbedaan pendapat, yang menyebabkan konflik dalam interaksi sosial.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Keterampilan Interpersonal', 'Ybs mampu membangun dan mempertahankan hubungan sosial yang cukup baik, meskipun terkadang membutuhkan arahan tambahan.', 'Kemampuan untuk berkomunikasi secara efektif dan memahami kebutuhan orang lain cukup memadai, meskipun ada ruang untuk peningkatan dalam empati.', 'Ybs cukup mampu bekerja sama dengan orang lain dalam berbagai situasi, meskipun terkadang kurang inisiatif dalam membangun hubungan yang lebih dalam.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Keterampilan Interpersonal', 'Ybs menunjukkan kemampuan yang baik dalam membangun dan mempertahankan hubungan sosial yang positif, mampu menciptakan suasana yang nyaman dan mendukung.', 'Kemampuan untuk berkomunikasi secara efektif, mendengarkan secara aktif, dan memberikan umpan balik yang konstruktif sangat baik, mampu membangun hubungan yang saling percaya dan menghargai.', 'Ybs sangat mampu bekerja sama dengan orang lain dalam berbagai situasi, mampu membangun tim yang solid dan efektif.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Keterampilan Interpersonal', 'Ybs memiliki kemampuan yang sangat tinggi dalam membangun dan memimpin hubungan sosial yang kompleks, mampu menginspirasi dan memotivasi orang lain.', 'Kemampuan untuk berkomunikasi secara sangat efektif, memahami kebutuhan dan perasaan orang lain dengan sangat baik, dan membangun hubungan yang sangat mendalam dan bermakna.', 'Ybs memiliki kemampuan yang luar biasa dalam membangun jaringan sosial yang luas dan beragam, mampu menciptakan lingkungan yang inklusif dan kolaboratif.');

-- Insert descriptions for 'Sistematika Kerja' competency
-- Rendah (R)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Rendah', 'Sistematika Kerja', 'Kemudian, menunjukkan kesulitan dalam membuat rencana kerja yang terstruktur, seringkali memulai tugas tanpa persiapan yang memadai.', 'Kemudian, kemampuan untuk mengorganisasikan tugas-tugas secara efisien sangat terbatas, yang menyebabkan seringnya terjadi ketidakteraturan dan penundaan.', 'Kemudian, cenderung kesulitan dalam mengikuti alur kerja yang sistematis, seringkali melewatkan langkah-langkah penting dalam proses penyelesaian pekerjaan.');

-- Kurang (K)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Kurang', 'Sistematika Kerja', 'Kemudian, menunjukkan upaya yang kurang maksimal dalam merencanakan tugas-tugas, terkadang mengabaikan detail-detail penting dalam proses perencanaan.', 'Kemudian, kemampuan untuk mengorganisasikan tugas-tugas masih berkembang, terkadang mengalami kesulitan dalam mengatur prioritas dan alokasi waktu.', 'Kemudian, cenderung kurang konsisten dalam mengikuti alur kerja yang sistematis, terkadang melakukan penyimpangan yang tidak perlu.');

-- Cukup (C)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Cukup', 'Sistematika Kerja', 'Kemudian, mampu membuat rencana kerja yang cukup terstruktur, meskipun terkadang membutuhkan pengawasan tambahan.', 'Kemudian, kemampuan untuk mengorganisasikan tugas-tugas cukup memadai, meskipun ada ruang untuk peningkatan dalam efisiensi dan ketepatan waktu.', 'Kemudian, mampu mengikuti alur kerja yang sistematis dengan cukup baik, meskipun terkadang membutuhkan bantuan untuk mengatasi hambatan.');

-- Baik (B)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Baik', 'Sistematika Kerja', 'Kemudian, menunjukkan kemampuan yang baik dalam membuat rencana kerja yang terstruktur dan detail, mampu mengantisipasi potensi hambatan.', 'Kemudian, kemampuan untuk mengorganisasikan tugas-tugas sangat baik, mampu mengatur prioritas dan alokasi waktu dengan efisien.', 'Kemudian, mampu mengikuti alur kerja yang sistematis dengan sangat baik, mampu mengidentifikasi dan mengatasi hambatan dengan cepat.');

-- Tinggi (T)
INSERT INTO description_options (tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3) VALUES
('Tinggi', 'Sistematika Kerja', 'Kemudian, memiliki kemampuan yang sangat tinggi dalam membuat rencana kerja yang komprehensif dan strategis, mampu mengintegrasikan berbagai aspek pekerjaan.', 'Kemudian, kemampuan untuk mengorganisasikan tugas-tugas sangat luar biasa, mampu menciptakan sistem kerja yang efisien dan efektif.', 'Kemudian, mampu mengikuti dan mengembangkan alur kerja yang sistematis dengan sangat baik, mampu melakukan optimasi dan inovasi dalam proses penyelesaian pekerjaan.');

-- Example query to get random descriptions for a specific category and competency
-- SELECT tingkat_evaluasi, kompetensi, deskripsi_1, deskripsi_2, deskripsi_3 
-- FROM description_options 
-- WHERE tingkat_evaluasi = 'Rendah' AND kompetensi = 'Logika Berpikir' 
-- LIMIT 1;