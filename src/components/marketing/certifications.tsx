interface Cert {
  name: string;
  description: string;
}

const CERTIFICATIONS: Cert[] = [
  { name: "IEC 62040",    description: "UPS performance standard"       },
  { name: "ISO 9001",     description: "Quality management system"      },
  { name: "CE",           description: "European conformity"            },
  { name: "RoHS",         description: "Hazardous substances directive" },
  { name: "IEC 60601",    description: "Medical electrical equipment"   },
  { name: "SANS 1825",    description: "SA national standard for UPS"   },
];

export function Certifications() {
  return (
    <section className="border-t py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center text-2xl font-medium">
          Certifications & compliance
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-center gap-2 rounded-xl border bg-background px-4 py-5 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">{cert.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
