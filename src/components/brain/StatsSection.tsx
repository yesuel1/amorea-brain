import { Card } from "@/components/ui/Card";

const stats = [
  {
    label: "나의 뇌나이",
    value: "38",
    unit: "세",
    subtext: "실제 나이보다 -17세",
    color: "text-vb-coral",
    bgColor: "bg-vb-coral/10",
  },
  {
    label: "동년배 상위",
    value: "8",
    unit: "%",
    subtext: "50대 기준",
    color: "text-vb-teal",
    bgColor: "bg-vb-teal/10",
  },
  {
    label: "총 운동일",
    value: "45",
    unit: "일",
    subtext: "연속 12일 진행 중",
    color: "text-vb-blue",
    bgColor: "bg-vb-blue/10",
  },
];

export function StatsSection() {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} padding="sm" className="text-center">
            <div className={`inline-block px-2 py-1 rounded-lg ${stat.bgColor} mb-2`}>
              <span className="text-xs text-vb-muted">{stat.label}</span>
            </div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-sm text-vb-muted">{stat.unit}</span>
            </div>
            <p className="text-xs text-vb-muted mt-1">{stat.subtext}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
