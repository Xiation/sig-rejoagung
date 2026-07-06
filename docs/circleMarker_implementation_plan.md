# Plan: Color-Coded CircleMarkers untuk Aset & Fasum Desa

## Diagnosa Root Cause

Masalah "mark" yang muncul bukan error kode, tapi **Leaflet gagal load file gambar icon**
(`marker-icon.png`, `marker-shadow.png`) karena Next.js tidak bisa melayani file statis
dari dalam `node_modules/leaflet/dist/images/` secara langsung.

Ini behavior default `<GeoJSON>` — ia me-render setiap Point feature menggunakan
`L.Marker` (yang butuh gambar icon), bukan `L.CircleMarker`.

---

## Solusi: `pointToLayer` Prop

Komponen `<GeoJSON>` di React-Leaflet punya prop bernama `pointToLayer`.
Prop ini adalah fungsi callback yang dipanggil untuk **setiap feature Point**,
dan kita bisa pakai untuk mengembalikan `L.circleMarker()` alih-alih `L.Marker`.

```
GeoJSON pointToLayer: (feature, latlng) => L.circleMarker(latlng, options)
```

---

## Data Schema dari File GeoJSON Asli

Berdasarkan hasil inspeksi file GeoJSON:

| File | Key Pembeda | Contoh Nilai |
|---|---|---|
| `pemerintah.geojson` | `"name": "pemerintah"` di root | `NAMOBJ: "Kantor Desa Rejoagung"` |
| `tempat ibadah.geojson` | `"name": "tempat ibadah"` di root | `NAMOBJ: "Masjid Al-Ikhlas"` |

> [!WARNING]
> Kedua file tidak punya property `KATEGORI` di dalam setiap feature!
> Saat di-merge ke satu FeatureCollection, kita **kehilangan informasi** asal file
> dari mana setiap feature berasal. Ini yang perlu kita atasi.

---

## Strategi: Tag `_source` saat Merge

Saat fetching dan merging data di `useEffect`, kita inject property tambahan
`_source` ke setiap feature sebelum digabung:

```ts
// Di dalam loop responses.forEach(...)
responses.forEach((data, index) => {
  if (data && data.features) {
    const tagged = data.features.map((f: any) => ({
      ...f,
      properties: {
        ...f.properties,
        _source: targetFiles[index], // Tandai asal filenya
      }
    }));
    mergedGeoData = mergedGeoData.concat(tagged);
  }
});
```

---

## Color Palette (sesuai TRD & SCOPE)

| Kategori | Warna Fill | Warna Border | Radius |
|---|---|---|---|
| `pemerintah` (Governance) | `#ea580c` (Orange) | `#ffffff` | 10 |
| `tempat ibadah` (Worship) | `#2563eb` (Blue) | `#ffffff` | 8 |
| *(Pendidikan — nanti)* | `#10b981` (Emerald) | `#ffffff` | 8 |

> Mengacu pada TRD Section 4.A:
> - Office Centers → Orange Circle (`#ea580c`, radius 10)
> - Places of Worship → Blue Circle (`#2563eb`, radius 7)

---

## Helper Function: `getMarkerStyle`

Tambahkan fungsi helper di luar komponen `MapComponent` untuk
memetakan `_source` ke opsi CircleMarker:

```tsx
function getMarkerStyle(source: string): L.CircleMarkerOptions {
  if (source.includes("pemerintah")) {
    return {
      radius: 10,
      fillColor: "#ea580c",   // Orange — Pemerintahan
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  if (source.includes("tempat")) {
    return {
      radius: 8,
      fillColor: "#2563eb",   // Blue — Tempat Ibadah
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  if (source.includes("pendidikan")) {
    return {
      radius: 8,
      fillColor: "#10b981",   // Emerald Green — Pendidikan
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    };
  }
  // Fallback default
  return { radius: 7, fillColor: "#6b7280", color: "#ffffff", weight: 2, fillOpacity: 0.8 };
}
```

---

## Perubahan Kode yang Diperlukan

Ada **2 lokasi** yang perlu diubah di `MapComponent.tsx`:

### Perubahan 1 — `useEffect` di lines 87–92 (merge data)

Tambahkan tagging `_source` saat loop merge:

```tsx
// SEBELUM (lines 87-92):
let mergedGeoData: any[] = [];
responses.forEach((data) => {
  if (data && data.features) {
    mergedGeoData = mergedGeoData.concat(data.features);
  }
});

// SESUDAH:
let mergedGeoData: any[] = [];
responses.forEach((data, index) => {
  if (data && data.features) {
    const tagged = data.features.map((f: any) => ({
      ...f,
      properties: { ...f.properties, _source: targetFiles[index] }
    }));
    mergedGeoData = mergedGeoData.concat(tagged);
  }
});
```

### Perubahan 2 — `<GeoJSON>` di lines 202–215 (render)

Tambahkan prop `pointToLayer` dan hapus dummy data yang sudah tidak diperlukan:

```tsx
// SEBELUM (lines 202-215):
{geoData && (
  <GeoJSON 
    key={activeModule}
    data={geoData} 
    onEachFeature={(feature: Feature, layer: Layer) => {
      layer.on({
        click: () => {
          setSelectedAsset(feature.properties);
          setIsModalOpen(true);
        }
      });
    }}
  />
)}

// SESUDAH:
{geoData && (
  <GeoJSON 
    key={activeModule}
    data={geoData}
    pointToLayer={(feature, latlng) => {
      // Ambil style berdasarkan _source yang sudah kita tag saat merge
      const style = getMarkerStyle(feature.properties?._source ?? "");
      return L.circleMarker(latlng, style);
    }}
    onEachFeature={(feature: Feature, layer: Layer) => {
      // Bind popup langsung di layer (mobile-first, on-click)
      const props = feature.properties;
      layer.bindPopup(`
        <div style="min-width:180px">
          <strong style="font-size:14px">${props?.NAMOBJ ?? "Data Tidak Tersedia"}</strong>
          <hr style="margin:6px 0"/>
          <p style="font-size:12px;color:#6b7280">${props?.REMARK ?? "Tidak ada keterangan"}</p>
        </div>
      `);
    }}
  />
)}
```

> [!NOTE]
> Popup sekarang menggunakan `layer.bindPopup()` — ini adalah pendekatan native Leaflet
> yang lebih efisien dan mobile-friendly dibanding InfoModal. Sesuai dengan requirement
> **M-04 (On-Click Information Display)** di SCOPE.md.

---

## Checklist Eksekusi

- [ ] Tambahkan fungsi `getMarkerStyle()` di atas fungsi `MapComponent` (setelah `MapBoundsEnforcer`)
- [ ] Update loop `responses.forEach` di `useEffect` untuk inject `_source`
- [ ] Update `<GeoJSON>` block dengan prop `pointToLayer` + `bindPopup`
- [ ] (Opsional) Hapus dummy data `CircleMarker` dan `Polygon` yang hardcoded setelah real data berfungsi
