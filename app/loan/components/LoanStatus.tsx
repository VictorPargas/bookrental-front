export default function LoanStatus({ status }: { status: string }) {
    const badgeClass = status === "Pendente" ? "bg-warning" : "bg-success";
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  }