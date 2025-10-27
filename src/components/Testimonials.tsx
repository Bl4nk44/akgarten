import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Maria S.",
    rating: 5,
    text: "Absolut professionell! Mein Garten sieht besser aus als je zuvor. Pünktlich, freundlich und sehr kompetent. Sehr zu empfehlen!"
  },
  {
    name: "Jürgen K.",
    rating: 5,
    text: "Vom ersten Kontakt bis zur Fertigstellung war alles perfekt. Super Arbeit, das Team hat meine Erwartungen übertroffen."
  },
  {
    name: "Helga W.",
    rating: 4,
    text: "Gute Beratung und saubere Ausführung der Arbeiten. Ein kleiner Abzug für eine leichte Verzögerung, aber das Ergebnis überzeugt."
  },
  {
    name: "Thomas B.",
    rating: 5,
    text: "Zuverlässig und mit viel Liebe zum Detail. Man merkt, dass hier Profis am Werk sind, die ihren Job lieben. Jederzeit wieder!"
  }
];

const TestimonialCard = ({ name, rating, text }: { name: string; rating: number; text: string }) => (
  <div className="bg-white/5 dark:bg-white/5 p-6 rounded-lg border border-white/10 shadow-lg h-full flex flex-col">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
        />
      ))}
    </div>
    <p className="text-gray-300 italic flex-grow">"{text}"</p>
    <p className="text-right font-medium text-white mt-4">- {name}</p>
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Was unsere Kunden sagen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}