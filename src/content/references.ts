// Every claim on the landing page points to one of these sources with a [[n]] marker.
// Only add a source after checking that the link opens and the source says what the text claims.

export type Reference = {
  id: number;
  citation: string;
  url: string;
};

export const references: Reference[] = [
  {
    id: 1,
    citation:
      "Schwarzenberg SJ, Georgieff MK; AAP Committee on Nutrition. Advocacy for Improving Nutrition in the First 1000 Days to Support Childhood Development and Adult Health. Pediatrics. 2018;141(2):e20173716.",
    url: "https://doi.org/10.1542/peds.2017-3716",
  },
  {
    id: 2,
    citation:
      "World Health Organization. WHO guideline for complementary feeding of infants and young children 6–23 months of age. Geneva: WHO; 2023.",
    url: "https://www.who.int/publications/i/item/9789240081864",
  },
  {
    id: 3,
    citation:
      "Peraturan Menteri Kesehatan RI Nomor 28 Tahun 2019 tentang Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia.",
    url: "https://peraturan.bpk.go.id/Details/138621",
  },
  {
    id: 4,
    citation:
      "Kementerian Kesehatan RI. Tabel Komposisi Pangan Indonesia 2017. Jakarta: Kemenkes RI; 2017.",
    url: "https://www.panganku.org/",
  },
  {
    id: 5,
    citation: "World Health Organization. WHO Child Growth Standards. Geneva: WHO; 2006.",
    url: "https://www.who.int/tools/child-growth-standards",
  },
  {
    id: 6,
    citation:
      "Wardle J, Cooke LJ, Gibson EL, et al. Increasing children's acceptance of vegetables; a randomized trial of parent-led exposure. Appetite. 2003;40(2):155–162.",
    url: "https://pubmed.ncbi.nlm.nih.gov/12781165/",
  },
  {
    id: 7,
    citation: "World Health Organization. WHO recommendations on antenatal care for a positive pregnancy experience. Geneva: WHO; 2016.",
    url: "https://www.who.int/publications/i/item/9789241549912",
  },
  {
    id: 8,
    citation: "PAHO/WHO. Guiding principles for complementary feeding of the breastfed child. Washington DC: PAHO; 2003.",
    url: "https://dipartimenti.unicatt.it/diana-4._INV_SC_NUTRI_04_Guiding_Principles_for_Complementary_Feeding_of_the_Breastfed_Child.pdf",
  },
];
