import { notFound } from "next/navigation"
import { getProgramConfig } from "@/lib/program-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Database } from "lucide-react"

export default function ProgramOverviewPage({
  params,
}: {
  params: { id: string }
}) {
  const program = getProgramConfig(params.id)

  if (!program) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: program.color }}>
          {program.name}
        </h1>
        <p className="text-muted-foreground">{program.title}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {program.contentTypes.map((contentType) => (
          <Card key={contentType.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                     style={{ backgroundColor: `${program.color}20` }}>
                  <Database className="h-6 w-6" style={{ color: program.color }} />
                </div>
              </div>
              <CardTitle className="mt-4">{contentType.pluralName}</CardTitle>
              <CardDescription>{contentType.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/admin/programs/${params.id}/${contentType.id}`}>
                <Button className="w-full" style={{ backgroundColor: program.color }}>
                  Manage {contentType.pluralName}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>About Content Management</CardTitle>
          <CardDescription>
            This program has {program.contentTypes.length} content type(s) configured.
            Each content type can have its own custom fields and structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Dynamic Fields:</strong> Each content type defines its own set of fields
            (text, rich text, images, dates, etc.)
          </p>
          <p>
            <strong>Automatic Forms:</strong> Forms and tables are automatically generated
            based on the field configuration.
          </p>
          <p>
            <strong>API Integration:</strong> All content is stored in the database and
            accessible via REST APIs for the frontend.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
