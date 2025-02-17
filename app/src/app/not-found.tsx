import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center p-4">
      <Card className="min-w-[280px]">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold">404</CardTitle>
          <CardDescription className="text-3xl font-medium">
            Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button size="lg" asChild className="text-lg">
            <a href="/">Go Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
