import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"



export default function StatsPanel({
  title,
  count = 0,
  percentage = "0%",
  lastDays = 7,
  responded,
  missed,
  sentiment,
  commitment,
  availability,
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {(count !== undefined || responded !== undefined) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{count}</p>
              <span className="text-sm text-green-500">{percentage}</span>
            </div>

            {responded !== undefined && missed !== undefined && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Respondidos</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold">{responded}</p>
                    <span className="text-sm text-green-500 ml-2">{percentage}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Perdidos</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold">{missed}</p>
                    <span className="text-sm text-green-500 ml-2">{percentage}</span>
                  </div>
                </div>
              </div>
            )}

            {lastDays && (
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <span>Últimos {lastDays} días</span>
                <span className="flex items-center ml-2 text-green-500">
                  <ArrowUp size={14} className="mr-1" /> 0
                </span>
                <span className="flex items-center ml-2 text-red-500">
                  <ArrowDown size={14} className="mr-1" /> 0
                </span>
              </div>
            )}
          </div>
        )}

        {(sentiment || commitment || availability) && (
          <div className="space-y-3 mt-2">
            {sentiment && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Sentimiento Positivo</span>
                <span className="text-sm text-red-500">{sentiment}</span>
              </div>
            )}
            {commitment && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Compromiso</span>
                <span className="text-sm text-red-500">{commitment}</span>
              </div>
            )}
            {availability && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Disponibilidad</span>
                <span className="text-sm text-green-500">{availability}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

