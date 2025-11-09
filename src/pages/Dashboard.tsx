import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, LogOut, Calendar, Clock, BookOpen, Award } from "lucide-react";
import { toast } from "sonner";
import BullRushLight from "../assets/BullRush-Light.svg";
import { Link } from "react-router-dom";
import PriorityNotesWidget from "../components/ui/PriorityNotesWidget";
import ChatLauncher from "../components/ui/ChatLauncher";
import Ub_mascot from "../assets/ub_mascot.png";
const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Mock student data
  const studentInfo = {
    name: "John Smith",
    studentId: "50123456",
    major: "Computer Science",
    year: "Junior",
    gpa: "3.75",
    credits: "78"
  };

  const priorities = [
    { id: 1, course: "CSE 442 - Software Engineering", priority: "High", time: "MWF 9:00 AM - 10:20 AM", credits: 3 },
    { id: 2, course: "CSE 460 - Data Intensive Computing", priority: "High", time: "TR 12:30 PM - 1:50 PM", credits: 3 },
    { id: 3, course: "CSE 474 - Machine Learning", priority: "Medium", time: "MWF 1:00 PM - 2:20 PM", credits: 3 },
    { id: 4, course: "MTH 411 - Probability Theory", priority: "Medium", time: "TR 9:30 AM - 10:50 AM", credits: 4 },
  ];

  const upcomingDeadlines = [
    { task: "Course Registration Opens", date: "Nov 15, 2025", type: "Registration" },
    { task: "Priority Registration Ends", date: "Nov 20, 2025", type: "Important" },
    { task: "General Registration Begins", date: "Nov 22, 2025", type: "Registration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">University at Buffalo</h1>
                <p className="text-xs text-muted-foreground">Calendar Priorities Portal</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            
          </div>
         
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex">
              <div className="p-4 w-full md:w-2/5">
          <PriorityNotesWidget />
          </div>
        <Card className="shadow-card w-full md:w-2/5">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome back, {studentInfo.name}!</CardTitle>
              <CardDescription>Student Portal - Spring 2026 Registration</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Student ID</p>
          <p className="font-semibold">{studentInfo.studentId}</p>
              </div>
              <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Major</p>
          <p className="font-semibold">{studentInfo.major}</p>
              </div>
              <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Year</p>
          <p className="font-semibold">{studentInfo.year}</p>
              </div>
              <div className="space-y-1">
          <p className="text-sm text-muted-foreground">GPA</p>
          <p className="font-semibold">{studentInfo.gpa}</p>
              </div>
              <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <p className="font-semibold">{studentInfo.credits}</p>
              </div>
              <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-semibold text-sm truncate">{userEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div>
      <Link
      to="/calendar"
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-semibold"
       // icon inherits this via currentColor
        aria-label="Go to Today (BullRush)"
        title="Go to Today (BullRush)"
          >
        <img src={BullRushLight} alt="BullRush Today icon" className="w-full h-full" />
    </Link></div>
 
            </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Course Priorities */}
          <Card className="md:col-span-2 shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle>Course Priorities - Spring 2026</CardTitle>
              </div>
              <CardDescription>Your ranked course selections for registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {priorities.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={item.priority === "High" ? "default" : "secondary"}>
                          Priority {index + 1}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          {item.credits} Credits
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground">{item.course}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle>Important Dates</CardTitle>
              </div>
              <CardDescription>Registration deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-1">
                    <Badge variant={deadline.type === "Important" ? "default" : "outline"} className="mb-2">
                      {deadline.type}
                    </Badge>
                    <p className="font-medium text-sm">{deadline.task}</p>
                    <p className="text-sm text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Academic Standing */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <CardTitle>Academic Standing</CardTitle>
            </div>
            <CardDescription>Your current academic status and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Semester GPA</p>
                <p className="text-2xl font-bold text-primary">3.82</p>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Credits This Semester</p>
                <p className="text-2xl font-bold text-primary">15</p>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Standing</p>
                <p className="text-2xl font-bold text-primary">Good</p>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Dean's List</p>
                <p className="text-2xl font-bold text-primary">Yes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
        <>
      <ChatLauncher  title="BullsFocus Assistant" iconSrc={Ub_mascot}
  placeholder="Life is good. Just do all is well"/>
    </>
    </div>
  );
};

export default Dashboard;
