"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

type TestData = {
  id: string;
  no_tes: string;
  nama_peserta: string;
  tanggal_lahir: string;
  nama_pt?: string;
  sdr_sdri: string;
  jenis_kelamin: string;
  tanggal_tes: string;
  phq?: string;
  keterangan_phq?: string;
  ist?: {
    se_konkrit_praktis: number;
    wa_verbal: number;
    an_fleksibilitas_pikir: number;
    ge_daya_abstraksi_verbal: number;
    ra_berpikir_praktis: number;
    iq: number;
    iq_classification: string;
    wa_ge: number;
  };
  papikostick?: {
    n: number;
    g: number;
    a: number;
    l: number;
    p: number;
    i: number;
    t: number;
    v: number;
    s: number;
    b: number;
    o: number;
    x: number;
    c: number;
    d: number;
    r: number;
    z: number;
    e: number;
    k: number;
    f: number;
    w: number;
    ng: number;
    cdr: number;
    tv: number;
    pi: number;
    bs: number;
    zk: number;
  };
};

// Function to get random description for each category
const getRandomDescription = async (category: string) => {
  try {
    // Map old category names to new format
    const categoryMap: { [key: string]: string } = {
      Rendah: "R",
      Kurang: "K",
      Cukup: "C",
      Baik: "B",
      Tinggi: "T",
    };

    const mappedCategory = categoryMap[category] || category;

    // Query the database for a random description matching the category
    const { data, error } = await supabase
      .from("description_options")
      .select("description, kompetensi, hasil_evaluasi")
      .eq("category", mappedCategory)
      .order("RANDOM()")
      .limit(1);

    if (error) {
      console.error("Error fetching description:", error);
      return { description: category, kompetensi: "", hasil_evaluasi: "" }; // Return the category name as fallback
    }

    // Return the description if found, otherwise return the category name
    return data && data.length > 0
      ? {
          description: data[0].description,
          kompetensi: data[0].kompetensi,
          hasil_evaluasi: data[0].hasil_evaluasi,
        }
      : { description: category, kompetensi: "", hasil_evaluasi: "" };
  } catch (error) {
    console.error("Error in getRandomDescription:", error);
    return { description: category, kompetensi: "", hasil_evaluasi: "" }; // Return the category name as fallback
  }
};

type Description = {
  description: string;
  kompetensi: string;
  hasil_evaluasi: string;
};

type Descriptions = {
  [key: string]: Description;
};

export default function ReportDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [descriptions, setDescriptions] = useState<Descriptions>({});
  const [descriptionsLoading, setDescriptionsLoading] = useState(true);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const { data, error } = await supabase
          .from("personal_info")
          .select(
            `
            id, no_tes, nama_peserta, tanggal_lahir, nama_pt, sdr_sdri, jenis_kelamin, tanggal_tes, phq, keterangan_phq,
            ist(se_konkrit_praktis, wa_verbal, an_fleksibilitas_pikir, ge_daya_abstraksi_verbal, ra_berpikir_praktis, iq, iq_classification, wa_ge),
            papikostick(n, g, a, l, p, i, t, v, s, b, o, x, c, d, r, z, e, k, f, w, ng, cdr, tv, pi, bs, zk)
          `
          )
          .eq("id", params.id)
          .single();

        if (error) throw error;

        // Transform data for display
        const transformedData: TestData = {
          ...data,
          ist: data.ist || undefined,
          papikostick: data.papikostick || undefined,
        };

        setTestData(transformedData);
      } catch (error) {
        console.error("Error fetching test data:", error);
        alert("Gagal memuat data tes");
        router.push("/dashboard/reports");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [params.id, router]);

  // Fetch descriptions when testData changes
  useEffect(() => {
    const fetchDescriptions = async () => {
      if (!testData) return;

      setDescriptionsLoading(true);
      try {
        // Fetch all needed descriptions
        const categories = ["Rendah", "Kurang", "Cukup", "Baik", "Tinggi"];
        const descriptionPromises = categories.map((category) =>
          getRandomDescription(category).then((result) => ({
            category,
            description: result.description,
            kompetensi: result.kompetensi,
            hasil_evaluasi: result.hasil_evaluasi,
          }))
        );

        const results = await Promise.all(descriptionPromises);

        // Convert to object format for easy access
        const descriptionsObj: Descriptions = {};
        results.forEach(
          ({ category, description, kompetensi, hasil_evaluasi }) => {
            descriptionsObj[category] = {
              description,
              kompetensi,
              hasil_evaluasi,
            };
          }
        );

        setDescriptions(descriptionsObj);
      } catch (error) {
        console.error("Error fetching descriptions:", error);
      } finally {
        setDescriptionsLoading(false);
      }
    };

    fetchDescriptions();
  }, [testData]);

  const exportToExcel = async () => {
    if (!testData) return;

    setExportLoading(true);
    try {
      // Transform data for Excel
      const excelData = [
        {
          "No Tes": testData.no_tes,
          "Nama Peserta": testData.nama_peserta,
          "Tanggal Lahir": dayjs(testData.tanggal_lahir).format("DD/MM/YYYY"),
          "Nama PT": testData.nama_pt || "-",
          "SDR/SDRI": testData.sdr_sdri,
          "Jenis Kelamin": testData.jenis_kelamin,
          "Tanggal Tes": dayjs(testData.tanggal_tes).format("DD/MM/YYYY"),
          PHQ: testData.phq || "-",
          "Keterangan PHQ": testData.keterangan_phq || "-",
          // IST data
          "SE / Konkrit Praktis": testData.ist?.se_konkrit_praktis || 0,
          "WA / Verbal": testData.ist?.wa_verbal || 0,
          "AN / Fleksibilitas Pikir": testData.ist?.an_fleksibilitas_pikir || 0,
          "GE / Daya Abstraksi Verbal":
            testData.ist?.ge_daya_abstraksi_verbal || 0,
          "RA / Berpikir Praktis": testData.ist?.ra_berpikir_praktis || 0,
          IQ: testData.ist?.iq || 0,
          "Klasifikasi IQ": testData.ist?.iq_classification || "-",
          "WA GE": testData.ist?.wa_ge || 0,
          // PAPIKOSTICK data
          N: testData.papikostick?.n || 0,
          G: testData.papikostick?.g || 0,
          A: testData.papikostick?.a || 0,
          L: testData.papikostick?.l || 0,
          P: testData.papikostick?.p || 0,
          I: testData.papikostick?.i || 0,
          T: testData.papikostick?.t || 0,
          V: testData.papikostick?.v || 0,
          S: testData.papikostick?.s || 0,
          B: testData.papikostick?.b || 0,
          O: testData.papikostick?.o || 0,
          X: testData.papikostick?.x || 0,
          C: testData.papikostick?.c || 0,
          D: testData.papikostick?.d || 0,
          R: testData.papikostick?.r || 0,
          Z: testData.papikostick?.z || 0,
          E: testData.papikostick?.e || 0,
          K: testData.papikostick?.k || 0,
          F: testData.papikostick?.f || 0,
          W: testData.papikostick?.w || 0,
          NG: testData.papikostick?.ng || 0,
          CDR: testData.papikostick?.cdr || 0,
          TV: testData.papikostick?.tv || 0,
          PI: testData.papikostick?.pi || 0,
          BS: testData.papikostick?.bs || 0,
          ZK: testData.papikostick?.zk || 0,
        },
      ];

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tes Psikologis");

      // Generate Excel file
      XLSX.writeFile(
        workbook,
        `Data_Tes_${testData.no_tes}_${testData.nama_peserta}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Gagal mengekspor data ke Excel");
    } finally {
      setExportLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Data tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:p-0 print:m-0">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-semibold">
          Detail Laporan Tes Psikologis
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={printReport}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Print
          </button>
          <button
            onClick={exportToExcel}
            disabled={exportLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading ? "Mengekspor..." : "Export ke Excel"}
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-white shadow overflow-hidden rounded-lg print:shadow-none print:border-0">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Laporan Tes Psikologis
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            No. Tes: {testData.no_tes}
          </p>
        </div>

        {/* Personal Information */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Nama Peserta:
                </p>
                <p className="text-base">{testData.nama_peserta}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tanggal Lahir:
                </p>
                <p className="text-base">
                  {dayjs(testData.tanggal_lahir).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nama PT:</p>
                <p className="text-base">{testData.nama_pt || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">SDR/SDRI:</p>
                <p className="text-base">{testData.sdr_sdri}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Jenis Kelamin:
                </p>
                <p className="text-base">{testData.jenis_kelamin}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tanggal Tes:
                </p>
                <p className="text-base">
                  {dayjs(testData.tanggal_tes).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">PHQ:</p>
                <p className="text-base">{testData.phq || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Keterangan PHQ:
                </p>
                <p className="text-base">{testData.keterangan_phq || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* IST Data */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              IST (Intelligence Structure Test)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  SE / Konkrit Praktis:
                </p>
                <p className="text-base">
                  {testData.ist?.se_konkrit_praktis || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  WA / Verbal:
                </p>
                <p className="text-base">{testData.ist?.wa_verbal || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  AN / Fleksibilitas Pikir:
                </p>
                <p className="text-base">
                  {testData.ist?.an_fleksibilitas_pikir || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  GE / Daya Abstraksi Verbal:
                </p>
                <p className="text-base">
                  {testData.ist?.ge_daya_abstraksi_verbal || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  RA / Berpikir Praktis:
                </p>
                <p className="text-base">
                  {testData.ist?.ra_berpikir_praktis || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">WA GE:</p>
                <p className="text-base">
                  {testData.ist?.wa_ge?.toFixed(2) || 0}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">IQ:</p>
                <p className="text-xl font-semibold">
                  {testData.ist?.iq?.toFixed(2) || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Klasifikasi IQ:
                </p>
                <p className="text-xl font-semibold">
                  {testData.ist?.iq_classification || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PAPIKOSTICK Data */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              PAPIKOSTICK
            </h3>

            {/* Raw Values */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Nilai Mentah
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {testData.papikostick &&
                  Object.entries(testData.papikostick)
                    .filter(
                      ([key]) =>
                        !["ng", "cdr", "tv", "pi", "bs", "zk"].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-gray-500 uppercase">
                          {key}:
                        </p>
                        <p className="text-base">{value}</p>
                      </div>
                    ))}
              </div>
            </div>

            {/* Calculated Values */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Nilai Perhitungan
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">NG:</p>
                  <p className="text-base font-semibold">
                    {testData.papikostick?.ng || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CDR:</p>
                  <p className="text-base font-semibold">
                    {testData.papikostick?.cdr || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">TV:</p>
                  <p className="text-base font-semibold">
                    {testData.papikostick?.tv || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">PI:</p>
                  <p className="text-base font-semibold">
                    {testData.papikostick?.pi || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">BS:</p>
                  <p className="text-base font-semibold">
                    {testData.papikostick?.bs || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ZK:</p>
                  <p className="text-base font-semibold">
                    {testData.papikostick?.zk || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kompetensi & Hasil Evaluasi */}
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Kompetensi & Hasil Evaluasi
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Logika Berpikir 1:
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.ist?.ra_berpikir_praktis &&
                      testData.ist.ra_berpikir_praktis < 80
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.ist?.ra_berpikir_praktis &&
                      testData.ist.ra_berpikir_praktis < 100
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.ist?.ra_berpikir_praktis &&
                      testData.ist.ra_berpikir_praktis < 120
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.ist?.ra_berpikir_praktis &&
                      testData.ist.ra_berpikir_praktis < 140
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Daya Analisa 3:
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.ist?.an_fleksibilitas_pikir &&
                      testData.ist.an_fleksibilitas_pikir < 80
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.ist?.an_fleksibilitas_pikir &&
                      testData.ist.an_fleksibilitas_pikir < 100
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.ist?.an_fleksibilitas_pikir &&
                      testData.ist.an_fleksibilitas_pikir < 120
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.ist?.an_fleksibilitas_pikir &&
                      testData.ist.an_fleksibilitas_pikir < 140
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Kemampuan Verbal 2 dan 4:
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.ist?.wa_ge && testData.ist.wa_ge < 80
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.ist?.wa_ge && testData.ist.wa_ge < 100
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.ist?.wa_ge && testData.ist.wa_ge < 120
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.ist?.wa_ge && testData.ist.wa_ge < 140
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Kemampuan Numerik 5:
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.ist?.se_konkrit_praktis &&
                      testData.ist.se_konkrit_praktis < 80
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.ist?.se_konkrit_praktis &&
                      testData.ist.se_konkrit_praktis < 100
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.ist?.se_konkrit_praktis &&
                      testData.ist.se_konkrit_praktis < 120
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.ist?.se_konkrit_praktis &&
                      testData.ist.se_konkrit_praktis < 140
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Sistematika Kerja (CDR):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.cdr && testData.papikostick.cdr < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.cdr && testData.papikostick.cdr < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.cdr && testData.papikostick.cdr < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.cdr && testData.papikostick.cdr < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.cdr === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Orientasi Hasil (NG):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.ng && testData.papikostick.ng < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.ng && testData.papikostick.ng < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.ng && testData.papikostick.ng < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.ng && testData.papikostick.ng < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.ng === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fleksibilitas (TV):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.tv && testData.papikostick.tv < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.tv && testData.papikostick.tv < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.tv && testData.papikostick.tv < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.tv && testData.papikostick.tv < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.tv === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Motivasi Berprestasi (A):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.a && testData.papikostick.a < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.a && testData.papikostick.a < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.a && testData.papikostick.a < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.a && testData.papikostick.a < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.a === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Kerjasama (PI):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.pi && testData.papikostick.pi < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.pi && testData.papikostick.pi < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.pi && testData.papikostick.pi < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.pi && testData.papikostick.pi < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.pi === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Keterampilan Interpersonal (BS):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.bs && testData.papikostick.bs < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.bs && testData.papikostick.bs < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.bs && testData.papikostick.bs < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.bs && testData.papikostick.bs < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.bs === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Stabilitas Emosi (E PHQ):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.e && testData.papikostick.e < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.e && testData.papikostick.e < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.e && testData.papikostick.e < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.e && testData.papikostick.e < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.e === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pengembangan Diri (W):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.w && testData.papikostick.w < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.w && testData.papikostick.w < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.w && testData.papikostick.w < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.w && testData.papikostick.w < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.w === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Mengelola Perubahan (ZK):
                </p>
                <p className="text-base">
                  {descriptionsLoading
                    ? "Loading..."
                    : testData.papikostick?.zk && testData.papikostick.zk < 2
                    ? `Rendah - ${descriptions["Rendah"] || "Rendah"}`
                    : testData.papikostick?.zk && testData.papikostick.zk < 4
                    ? `Kurang - ${descriptions["Kurang"] || "Kurang"}`
                    : testData.papikostick?.zk && testData.papikostick.zk < 6
                    ? `Cukup - ${descriptions["Cukup"] || "Cukup"}`
                    : testData.papikostick?.zk && testData.papikostick.zk < 9
                    ? `Baik - ${descriptions["Baik"] || "Baik"}`
                    : testData.papikostick?.zk === 9
                    ? `Tinggi - ${descriptions["Tinggi"] || "Tinggi"}`
                    : `Cukup - ${descriptions["Cukup"] || "Cukup"}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
