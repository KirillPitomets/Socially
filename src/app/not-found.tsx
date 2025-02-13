import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-4 px-16">
        <CardContent>
          <h2 className="font-extrabold text-7xl">404</h2>
          <p className="font-bold text-xl">Page not found :(</p>
        </CardContent>
        <CardFooter>
          <Link href={"/"}>
            <Button>
              <HomeIcon/>
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFound
