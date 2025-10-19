import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Clock, Users, Filter } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Events</h1>
        <p className="text-xl text-gray-600 mb-8">Join us at our upcoming events and connect with the FOSS community</p>

        <Tabs defaultValue="upcoming" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-3/4">
                <div className="space-y-6">
                  {/* Featured Event */}
                  <Card className="border-blue-200 shadow-md">
                    <CardHeader className="bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="bg-blue-100 text-blue-800 mb-2">Featured Event</Badge>
                          <CardTitle className="text-2xl">FOSS Andhra Annual Conference 2025</CardTitle>
                          <CardDescription>A celebration of open source innovation and community</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img
                            src="/placeholder.svg?height=300&width=400&text=Annual+Conference"
                            alt="Annual Conference"
                            className="rounded-lg w-full h-auto"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <div className="space-y-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              <span>March 15-16, 2025</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>Visakhapatnam Convention Center, Visakhapatnam</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="mr-2 h-4 w-4" />
                              <span>Expected Attendance: 500+</span>
                            </div>
                          </div>
                          <p className="mt-4">
                            Join us for the largest FOSS event in Andhra Pradesh, featuring keynote speakers, workshops,
                            project showcases, and networking opportunities. This two-day conference brings together
                            FOSS enthusiasts, developers, educators, and policymakers.
                          </p>
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button className="bg-blue-600 hover:bg-blue-700">Register Now</Button>
                            <Button variant="outline">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regular Events */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>FOSSynC Campus Workshop Series</CardTitle>
                          <CardDescription>Introduction to Open Source Development</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Workshop</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>February 10, 2025</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>JNTU Kakinada, Computer Science Department</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>10:00 AM - 4:00 PM</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        A hands-on workshop for students to learn the basics of open source development, including Git,
                        GitHub, and how to contribute to open source projects.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline" className="text-gray-500">
                        20 seats left
                      </Badge>
                      <Button>Register</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>FOSStorm Hackathon</CardTitle>
                          <CardDescription>Building Open Source Solutions for Local Challenges</CardDescription>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Hackathon</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>February 22-23, 2025</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Tech Hub Coworking Space, Vijayawada</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Starts at 9:00 AM (24-hour event)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        A 24-hour hackathon focused on developing open source solutions for local challenges in
                        education, agriculture, and governance. Cash prizes and mentorship opportunities available.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline" className="text-gray-500">
                        Team registration open
                      </Badge>
                      <Button>Register Team</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>FOSServe Government Workshop</CardTitle>
                          <CardDescription>Open Source Solutions for E-Governance</CardDescription>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Workshop</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>March 5, 2025</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Andhra Pradesh Secretariat, Amaravati</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>10:00 AM - 1:00 PM</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        A workshop for government officials on implementing open source solutions for e-governance,
                        document management, and citizen services. Case studies and implementation strategies will be
                        discussed.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline" className="text-gray-500">
                        By invitation
                      </Badge>
                      <Button>Request Invitation</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <div className="md:w-1/4">
                <div className="bg-gray-50 p-4 rounded-lg sticky top-20">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Filter className="mr-2 h-4 w-4" /> Filter Events
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Event Type</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="workshop" className="mr-2" />
                          <label htmlFor="workshop" className="text-sm">
                            Workshops
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="conference" className="mr-2" />
                          <label htmlFor="conference" className="text-sm">
                            Conferences
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="hackathon" className="mr-2" />
                          <label htmlFor="hackathon" className="text-sm">
                            Hackathons
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="meetup" className="mr-2" />
                          <label htmlFor="meetup" className="text-sm">
                            Meetups
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Location</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="vizag" className="mr-2" />
                          <label htmlFor="vizag" className="text-sm">
                            Visakhapatnam
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="vijayawada" className="mr-2" />
                          <label htmlFor="vijayawada" className="text-sm">
                            Vijayawada
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="tirupati" className="mr-2" />
                          <label htmlFor="tirupati" className="text-sm">
                            Tirupati
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="online" className="mr-2" />
                          <label htmlFor="online" className="text-sm">
                            Online
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Program</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="fosstar" className="mr-2" />
                          <label htmlFor="fosstar" className="text-sm">
                            FOSStar
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="fosserve" className="mr-2" />
                          <label htmlFor="fosserve" className="text-sm">
                            FOSServe
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="fossync" className="mr-2" />
                          <label htmlFor="fossync" className="text-sm">
                            FOSSynC
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="fosstorm" className="mr-2" />
                          <label htmlFor="fosstorm" className="text-sm">
                            FOSStorm
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="fossart" className="mr-2" />
                          <label htmlFor="fossart" className="text-sm">
                            FOSSart
                          </label>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline">Load More Events</Button>
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>FOSS Andhra Launch Event</CardTitle>
                      <CardDescription>Official launch of FOSS Andhra and its programs</CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Past Event</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>January 15, 2023</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Andhra University, Visakhapatnam</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    The official launch event of FOSS Andhra, featuring keynote speeches, program introductions, and a
                    panel discussion on the future of open source in Andhra Pradesh.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+1"
                      alt="Event Photo 1"
                      className="rounded-md w-full h-auto"
                    />
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+2"
                      alt="Event Photo 2"
                      className="rounded-md w-full h-auto"
                    />
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+3"
                      alt="Event Photo 3"
                      className="rounded-md w-full h-auto"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View Event Details</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Open Source Day 2023</CardTitle>
                      <CardDescription>Celebrating Software Freedom Day</CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Past Event</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>September 16, 2023</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Multiple locations across Andhra Pradesh</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    A statewide celebration of Software Freedom Day with workshops, install fests, and awareness
                    programs about free and open source software across multiple cities.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+1"
                      alt="Event Photo 1"
                      className="rounded-md w-full h-auto"
                    />
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+2"
                      alt="Event Photo 2"
                      className="rounded-md w-full h-auto"
                    />
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+3"
                      alt="Event Photo 3"
                      className="rounded-md w-full h-auto"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View Event Details</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>FOSStorm Hackathon 2024</CardTitle>
                      <CardDescription>Building Open Source Solutions for Education</CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Past Event</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>January 20-21, 2024</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>SRM University, Amaravati</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    A 24-hour hackathon focused on developing open source solutions for educational challenges. Over 30
                    teams participated, creating innovative projects for classroom management, assessment tools, and
                    educational games.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+1"
                      alt="Event Photo 1"
                      className="rounded-md w-full h-auto"
                    />
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+2"
                      alt="Event Photo 2"
                      className="rounded-md w-full h-auto"
                    />
                    <img
                      src="/placeholder.svg?height=100&width=150&text=Event+Photo+3"
                      alt="Event Photo 3"
                      className="rounded-md w-full h-auto"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View Event Details</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">Load More Past Events</Button>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">February 2025</h3>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                <div className="text-sm font-medium text-gray-500">Sun</div>
                <div className="text-sm font-medium text-gray-500">Mon</div>
                <div className="text-sm font-medium text-gray-500">Tue</div>
                <div className="text-sm font-medium text-gray-500">Wed</div>
                <div className="text-sm font-medium text-gray-500">Thu</div>
                <div className="text-sm font-medium text-gray-500">Fri</div>
                <div className="text-sm font-medium text-gray-500">Sat</div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Week 1 */}
                <div className="p-2 text-gray-400">26</div>
                <div className="p-2 text-gray-400">27</div>
                <div className="p-2 text-gray-400">28</div>
                <div className="p-2 text-gray-400">29</div>
                <div className="p-2 text-gray-400">30</div>
                <div className="p-2 text-gray-400">31</div>
                <div className="p-2">1</div>

                {/* Week 2 */}
                <div className="p-2">2</div>
                <div className="p-2">3</div>
                <div className="p-2">4</div>
                <div className="p-2">5</div>
                <div className="p-2">6</div>
                <div className="p-2">7</div>
                <div className="p-2">8</div>

                {/* Week 3 */}
                <div className="p-2">9</div>
                <div className="p-2 bg-blue-100 rounded-md relative">
                  10
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                </div>
                <div className="p-2">11</div>
                <div className="p-2">12</div>
                <div className="p-2">13</div>
                <div className="p-2">14</div>
                <div className="p-2">15</div>

                {/* Week 4 */}
                <div className="p-2">16</div>
                <div className="p-2">17</div>
                <div className="p-2">18</div>
                <div className="p-2">19</div>
                <div className="p-2">20</div>
                <div className="p-2">21</div>
                <div className="p-2 bg-orange-100 rounded-md relative">
                  22
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></span>
                </div>

                {/* Week 5 */}
                <div className="p-2 bg-orange-100 rounded-md relative">
                  23
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></span>
                </div>
                <div className="p-2">24</div>
                <div className="p-2">25</div>
                <div className="p-2">26</div>
                <div className="p-2">27</div>
                <div className="p-2">28</div>
                <div className="p-2 text-gray-400">1</div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Events This Month:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                    <div>
                      <p className="font-medium">Feb 10: FOSSynC Campus Workshop</p>
                      <p className="text-sm text-gray-500">JNTU Kakinada, 10:00 AM - 4:00 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 mr-2"></div>
                    <div>
                      <p className="font-medium">Feb 22-23: FOSStorm Hackathon</p>
                      <p className="text-sm text-gray-500">Tech Hub Coworking Space, Vijayawada</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="mr-2">
                Previous Month
              </Button>
              <Button variant="outline">Next Month</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-blue-50 p-8 rounded-lg my-12">
          <h3 className="text-2xl font-bold mb-4">Host Your Own FOSS Event</h3>
          <p className="mb-6">
            Are you interested in hosting a FOSS event at your institution or organization? FOSS Andhra provides
            support, resources, and speakers for community-organized events.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/events/host">
              <Button className="bg-blue-600 hover:bg-blue-700">Host an Event</Button>
            </Link>
            <Link href="/events/speaker-request">
              <Button variant="outline" className="border-blue-200 text-blue-600">
                Request a Speaker
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
