import { HOME_SECTIONS } from "@/components/home/sections";

// The accumulating Home page: renders human-approved beats verbatim, in comp order.
export default function HomeAccumulating() {
  const approved = HOME_SECTIONS.filter((s) => s.approved);
  if (approved.length === 0) {
    return (
      <p style={{ padding: "40vh 24px", textAlign: "center" }}>
        No beats approved yet — review sections at /preview/home/section/&lt;slug&gt;.
      </p>
    );
  }
  return (
    <>
      {approved.map(({ slug, Component }) => (
        <Component key={slug} />
      ))}
    </>
  );
}
