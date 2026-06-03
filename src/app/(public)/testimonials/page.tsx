"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star } from "lucide-react";
import { TestimonialModal } from "@/components/testimonial-modal";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  message: string;
  rating: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTestimonials(data as Testimonial[]);
      });
  }, []);

  return (
    <section className="min-h-[calc(100vh-4rem)] px-4 py-16">
      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <h6 className="text-center text-xl font-bold text-blue-500">
            What clients and collaborators say? All testimonials are manually
            approved
          </h6>
        </div>

        {/* Testimonials grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No testimonials yet. Be the first to leave one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border-2 border-blue-500 p-6 flex flex-col h-70 transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--card)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "oklch(60% 0.18 232)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "oklch(60% 0.18 232)")
                }
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      style={{
                        fill:
                          i < t.rating ? "oklch(80% 0.18 85)" : "transparent",
                        color:
                          i < t.rating ? "oklch(80% 0.18 85)" : "var(--border)",
                      }}
                    />
                  ))}
                </div>

                {/* Message */}
                <p className="flex-1 text-sm text-muted-foreground leading-relaxed italic overflow-hidden">
                  {t.message}
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-3 mt-auto pt-3 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                    style={{ backgroundColor: "oklch(60% 0.18 232)" }}
                  >
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-blue-500">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit CTA */}
        <div
          className="mt-16 rounded-2xl p-10 text-center space-y-4"
          style={{ borderColor: "oklch(74.6% 0.16 232.661)" }}
        >
          <h3 className="text-xl font-bold text-blue-500">Worked with me?</h3>
          <p className="text-muted-foreground text-sm">
            I'd love to hear your feedback. All testimonials are reviewed before
            publishing.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xl font-bold text-blue-500 border-2 border-blue-500 transition-all hover:-translate-y-0.5"
            style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
          >
            Leave a Testimonial
          </button>
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { Star } from "lucide-react";
// import { TestimonialModal } from "@/components/testimonial-modal";

// interface Testimonial {
//   id: number;
//   name: string;
//   role: string;
//   company: string;
//   image: string;
//   message: string;
//   rating: number;
// }

// export default function TestimonialsPage() {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const supabase = createClient();
//     supabase
//       .from("testimonials")
//       .select("*")
//       .eq("approved", true)
//       .order("created_at", { ascending: false })
//       .then(({ data }) => {
//         if (data) setTestimonials(data as Testimonial[]);
//       });
//   }, []);

//   return (
//     <section className="min-h-[calc(100vh-4rem)] px-4 py-16">
//       <TestimonialModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//       />
//       <div className="max-w-6xl mx-auto w-full">
//         {/* Header */}
//         <div className="mb-10">
//           <h6 className="text-center text-xl font-bold text-blue-500">
//             What clients and collaborators say? All testimonials are manually
//             approved
//           </h6>
//         </div>

//         {/* Testimonials grid */}
//         {testimonials.length === 0 ? (
//           <div className="text-center py-20 text-muted-foreground">
//             No testimonials yet. Be the first to leave one!
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {testimonials.map((t) => (
//               <div
//                 key={t.id}
//                 className="rounded-2xl border-2 p-6 space-y-4 transition-all hover:-translate-y-1"
//                 style={{
//                   backgroundColor: "var(--card)",
//                   borderColor: "var(--border)",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.borderColor = "oklch(60% 0.18 232)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.borderColor = "var(--border)")
//                 }
//               >
//                 {/* Stars */}
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star
//                       key={i}
//                       className="h-4 w-4"
//                       style={{
//                         fill:
//                           i < t.rating ? "oklch(80% 0.18 85)" : "transparent",
//                         color:
//                           i < t.rating ? "oklch(80% 0.18 85)" : "var(--border)",
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {/* Message */}
//                 <p className="text-sm text-muted-foreground leading-relaxed italic">
//                   "{t.message}"
//                 </p>

//                 {/* Author */}
//                 <div
//                   className="flex items-center gap-3 pt-2 border-t"
//                   style={{ borderColor: "var(--border)" }}
//                 >
//                   <div
//                     className="w-9 h-9 rounded-full overflow-hidden shrink-0"
//                     style={{ backgroundColor: "oklch(60% 0.18 232)" }}
//                   >
//                     {t.image ? (
//                       <img
//                         src={t.image}
//                         alt={t.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
//                         {t.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")
//                           .slice(0, 2)}
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <p className="text-sm font-semibold text-foreground">
//                       {t.name}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {t.role}
//                       {t.company ? ` · ${t.company}` : ""}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Submit CTA */}
//         <div
//           className="mt-16 rounded-2xl p-10 text-center space-y-4"
//           style={{ borderColor: "oklch(74.6% 0.16 232.661)" }}
//         >
//           <h3 className="text-xl font-bold text-blue-500">Worked with me?</h3>
//           <p className="text-muted-foreground text-sm">
//             I'd love to hear your feedback. All testimonials are reviewed before
//             publishing.
//           </p>
//           <button
//             onClick={() => setModalOpen(true)}
//             className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xl font-bold text-blue-500 border-2 transition-all hover:-translate-y-0.5"
//             style={{ background: "oklch(60% 0.18 232 / 0.15)" }}
//           >
//             Leave a Testimonial
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
