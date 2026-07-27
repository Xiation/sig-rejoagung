export interface OlahragaTitik{
    namaFasilitas: string;
    alamat: string;
    koordinat: {
        lat: number;
        lng: number;
    };
}
export const OLAHRAGA_ASET: OlahragaTitik[] = [
    { 
        namaFasilitas: "RSC Rejoagung Sport Center",
        alamat: " Sumberagung, Rejoagung, Kec. Srono, Kabupaten Banyuwangi, Jawa Timur 68471",
        koordinat: {
            lat: -8.386578222828776,
            lng: 114.29964314279374
        },
    },
    {
        namaFasilitas: "Lapangan Rejoagung",
        alamat: "Sumbergroto, Rejoagung, Srono, Banyuwangi Regency, East Java 68471",
        koordinat: {
            lat: -8.39385251488808,
            lng: 114.31367960376035
        },
    },
]