import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Github, Star, CheckCircle, Image } from "lucide-react"

export default function FOSStormPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="px-3 py-1 text-orange-600 border-orange-200 font-medium">
            Program
          </Badge>
          <h1 className="text-4xl font-bold">FOSStorm</h1>
        </div>

        <p className="text-xl text-orange-600 mb-8">Community-led open source projects developed by FOSS Andhra</p>

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                FOSStorm is our initiative to develop community-led open source projects that address local challenges
                and contribute to the global FOSS ecosystem. Under this program, we bring together developers,
                designers, and domain experts to collaborate on impactful software solutions.
              </p>

              <p>
                Our projects focus on key areas like education, governance, digital inclusion, and regional language
                computing. All code developed under FOSStorm is released under open source licenses, allowing anyone to
                use, modify, and contribute to these projects.
              </p>

              <h3>Mission</h3>
              <p>
                To create a thriving ecosystem of open source projects that address local needs, showcase local talent,
                and contribute to the global open source community while promoting collaboration and knowledge sharing.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-orange-600" />
                    Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Collaborative development of open source software projects that address real-world needs and
                    challenges.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Github className="mr-2 h-5 w-5 text-orange-600" />
                    Open Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All projects are released under open source licenses, allowing free use, modification, and
                    distribution.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-orange-600" />
                    Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Creating software solutions that have real impact on communities, organizations, and individuals.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-orange-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-bold mb-4">Join FOSStorm</h3>
              <p className="mb-6">
                Are you a developer, designer, or domain expert interested in contributing to open source projects? Join
                FOSStorm and help us build impactful software solutions through community collaboration.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/programs/fosstorm/join">
                  <Button className="bg-orange-600 hover:bg-orange-700">Join as a Contributor</Button>
                </Link>
                <Link href="/programs/fosstorm/projects">
                  <Button variant="outline" className="border-orange-200 text-orange-600">
                    Explore Projects
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Code className="mr-2 h-6 w-6 text-orange-600" />
                Active Projects
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>TeluguNLP</CardTitle>
                        <CardDescription>Natural Language Processing toolkit for Telugu</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A comprehensive NLP toolkit for Telugu language, including tokenization, part-of-speech tagging,
                      sentiment analysis, and more. Aimed at improving Telugu language computing and accessibility.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        Python
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        NLP
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Machine Learning
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Telugu
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>120 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>48 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/telugu-nlp" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/programs/fosstorm/projects/telugu-nlp">
                      <Button className="bg-orange-600 hover:bg-orange-700">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>OpenEdu</CardTitle>
                        <CardDescription>Open source learning management system</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A lightweight, offline-first learning management system designed for schools with limited internet
                      connectivity. Supports content synchronization, multimedia lessons, and assessment tools.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        JavaScript
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        React
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Node.js
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Education
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>85 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>32 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/open-edu" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/programs/fosstorm/projects/open-edu">
                      <Button className="bg-orange-600 hover:bg-orange-700">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>CivicDocs</CardTitle>
                        <CardDescription>Document management for local governments</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Beta</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A secure document management system designed for local government offices, with features for
                      document digitization, workflow automation, e-signatures, and public records access.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        Python
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Django
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        PostgreSQL
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Governance
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>62 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>25 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/civic-docs" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/programs/fosstorm/projects/civic-docs">
                      <Button className="bg-orange-600 hover:bg-orange-700">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>FarmConnect</CardTitle>
                        <CardDescription>Open platform for farmers and agricultural data</CardDescription>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Development</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A mobile-first platform connecting farmers with agricultural resources, market information,
                      weather data, and expert advice. Includes offline functionality for rural areas with limited
                      connectivity.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        React Native
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Node.js
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        MongoDB
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Agriculture
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>48 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>18 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/farm-connect" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/programs/fosstorm/projects/farm-connect">
                      <Button className="bg-orange-600 hover:bg-orange-700">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Link href="/programs/fosstorm/projects">
                  <Button variant="outline" className="mt-4 border-orange-200 text-orange-600">
                    View All Projects
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contribute" className="mt-6">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Github className="mr-2 h-6 w-6 text-orange-600" />
                How to Contribute
              </h3>

              <div className="prose prose-lg max-w-none mb-8">
                <p>
                  We welcome contributions from developers, designers, testers, documentation writers, and domain
                  experts to our FOSStorm projects. Here's how you can get involved:
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Find a Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Browse our active projects and find one that matches your interests and skills. Each project has
                      its own GitHub repository with detailed information about the project goals and architecture.
                    </p>
                    <Link href="/programs/fosstorm/projects">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        Browse Projects
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Setup Development Environment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Follow the project's README file to set up your local development environment. Most projects
                      include detailed instructions for getting started with development.
                    </p>
                    <Link href="/programs/fosstorm/developer-guide">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        Development Guide
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Pick an Issue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Check the project's GitHub issues for beginner-friendly tasks, bug fixes, or feature requests.
                      Issues labeled "good first issue" are great starting points for new contributors.
                    </p>
                    <Link href="https://github.com/fossandhra" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        <Github className="mr-2 h-4 w-4" />
                        Browse Issues
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Make Contributions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Follow the project's contribution guidelines to submit your work. This typically involves forking
                      the repository, creating a branch, making changes, and submitting a pull request.
                    </p>
                    <Link href="/programs/fosstorm/contribution-guide">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        Contribution Guide
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-orange-50 p-8 rounded-lg">
                <h4 className="text-xl font-bold mb-4">Join the FOSStorm Developer Community</h4>
                <p className="mb-6">
                  Connect with other contributors, get help with issues, and stay updated on project developments by
                  joining our developer community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="https://discord.gg/fossandhra" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-orange-600 hover:bg-orange-700">Join Discord Community</Button>
                  </Link>
                  <Link href="https://matrix.to/#/#fossandhra:matrix.org" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-orange-200 text-orange-600">
                      Join Matrix Channel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Image className="mr-2 h-6 w-6 text-orange-600" />
              FOSStorm Project Gallery
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="overflow-hidden rounded-lg bg-gray-100 aspect-video relative group">
                  <img
                    src={`/placeholder.svg?height=450&width=800&text=Project+Screenshot+${item}`}
                    alt={`Project screenshot ${item}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h4 className="font-medium">Project Demo {item}</h4>
                    <p className="text-sm opacity-90">FOSStorm application interface</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" className="mt-4 border-orange-200 text-orange-600">
                View All Gallery Images
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
