
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function StatCard({ title, value, change, trend, description, icon }) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-gray-100 rounded-md">{icon}</div>
            <Badge
              variant="outline"
              className={
                trend === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {change}
            </Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    )
  }