import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const StatsCard = ({title, value}) => {
  return (
    <Card className={"py-3 md:py-6 gap-1 md:gap-6"}>
      <CardHeader >
        <CardTitle className="text-sm text-muted-foreground">
          {/* <h3>gggg</h3> */}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-base md:text-2xl font-bold">
          {/* <h3>ggggggggg</h3> */}
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard