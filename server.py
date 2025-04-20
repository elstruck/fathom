from livereload import Server, shell
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import parse_qs
import traceback
import sys
import cgi

# Email Configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 465
SENDER_EMAIL = 'elliott.wittstruck@gmail.com'
SENDER_PASSWORD = 'xwgu znow ailf notr'
RECIPIENT_EMAIL = 'elliott.wittstruck@gmail.com'

def ignore(filePath):
    """Ignore files like .git/, .DS_Store, etc."""
    fileName = os.path.basename(filePath)
    return (
        fileName.startswith('.') or  # Hidden files
        '__pycache__' in filePath or # Python cache
        '.git' in filePath           # Git directory
    )

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        """Set CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')

    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self._set_headers()
        self.end_headers()

    def log_message(self, format, *args):
        """Override the default logging to print to stdout"""
        print(f"{self.address_string()} - - [{self.log_date_time_string()}] {format%args}")

    def do_POST(self):
        print(f"Received POST request to {self.path}")
        if self.path == '/send-email':
            try:
                print("Processing email request...")
                
                # Parse multipart form data
                content_type, _ = cgi.parse_header(self.headers['Content-Type'])
                if content_type == 'multipart/form-data':
                    form = cgi.FieldStorage(
                        fp=self.rfile,
                        headers=self.headers,
                        environ={'REQUEST_METHOD': 'POST',
                               'CONTENT_TYPE': self.headers['Content-Type']}
                    )
                    
                    # Extract form fields
                    name = form.getvalue('name', '')
                    email = form.getvalue('email', '')
                    message = form.getvalue('message', '')
                    
                    print("Form data received:")
                    print(f"Name: {name}")
                    print(f"Email: {email}")
                    print(f"Message: {message}")
                    
                    # Create email message
                    msg = MIMEMultipart()
                    msg['From'] = SENDER_EMAIL
                    msg['To'] = RECIPIENT_EMAIL
                    msg['Subject'] = f'Fathom & Co. - New Contact Form Submission from {name}'
                    
                    # Email body
                    body = f"""
                    Name: {name}
                    Email: {email}
                    Message: {message}
                    """
                    msg.attach(MIMEText(body, 'plain'))
                    
                    print("Connecting to SMTP server...")
                    # Connect to Gmail's SMTP server
                    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
                    
                    print("Attempting to login...")
                    # Login to your Gmail account
                    server.login(SENDER_EMAIL, SENDER_PASSWORD)
                    
                    print("Sending email...")
                    # Send email
                    text = msg.as_string()
                    server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, text)
                    server.quit()
                    
                    print("Email sent successfully!")
                    # Send success response
                    self.send_response(200)
                    self._set_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'success'}).encode())
                else:
                    raise ValueError("Invalid content type. Expected multipart/form-data")
                
            except smtplib.SMTPAuthenticationError as e:
                print("SMTP Authentication Error:", str(e))
                print("Full traceback:")
                traceback.print_exc(file=sys.stdout)
                self.send_response(500)
                self._set_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'error', 
                    'message': 'Email authentication failed. Please check your email credentials.'
                }).encode())
                
            except Exception as e:
                print("Error occurred:")
                print("Full traceback:")
                traceback.print_exc(file=sys.stdout)
                self.send_response(500)
                self._set_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'error', 
                    'message': f'An error occurred: {str(e)}'
                }).encode())
        else:
            print(f"404: Path {self.path} not found")
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        print(f"Received GET request to {self.path}")
        # Serve static files
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            # Open the file
            with open('.' + self.path, 'rb') as file:
                self.send_response(200)
                # Set the content type based on file extension
                if self.path.endswith('.html'):
                    self.send_header('Content-type', 'text/html')
                elif self.path.endswith('.css'):
                    self.send_header('Content-type', 'text/css')
                elif self.path.endswith('.js'):
                    self.send_header('Content-type', 'application/javascript')
                self.end_headers()
                self.wfile.write(file.read())
        except FileNotFoundError:
            print(f"404: File {self.path} not found")
            self.send_response(404)
            self.end_headers()

# Create HTTP server
httpd = HTTPServer(('localhost', 8000), RequestHandler)

# Create livereload server
server = Server()

# Watch all HTML files, including those in subdirectories
server.watch('**/*.html')
server.watch('sections/*.html')  # Explicitly watch sections directory
# Watch CSS files in styles directory
server.watch('styles/*.css')
# Watch JavaScript files
server.watch('js/*.js')
# Watch asset files
server.watch('assets/*')

# Start the server
print("Server running at http://localhost:8000")
print("Make sure to configure your email settings in server.py")
httpd.serve_forever() 