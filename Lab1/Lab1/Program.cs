using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

//variant 3
namespace Lab1
{
    class Program
    {
        private static string _nick;
        private static EndPoint _remotePoint;
        private static readonly Socket Socket = new (AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        private static readonly List<(DateTime, string)> Messages = new();

        private static void StartPage()
        {
            try
            {
                Console.Clear();
                Console.WriteLine("Enter your nickname!");
                _nick = Console.ReadLine();
                Console.Clear();
                Console.WriteLine("Hello, " + _nick);
                Console.WriteLine("Enter your port");
                int myPort = Convert.ToInt32(Console.ReadLine());
                Socket.Bind(new IPEndPoint(IPAddress.Parse("127.0.0.1"), myPort));
                Console.WriteLine("Enter ip of your companion");
                var ip = Console.ReadLine();
                Console.WriteLine("Enter port of your companion");
                var port = Convert.ToInt32(Console.ReadLine());
                _remotePoint = new IPEndPoint(IPAddress.Parse(ip), port);
                Console.Clear();
            }
            catch
            {
                Error("Wrong format");
                Thread.Sleep(1500);
                StartPage();
            }
        }

        private static void ReceiveMessages()
        { 
            try
            {
                while (true)
                {
                    StringBuilder value = new ();
                    byte[] data = new byte[256];
                    do
                    {
                        var bytes = Socket.ReceiveFrom(data, ref _remotePoint);
                        value.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    }
                    while (Socket.Available > 0);

                    switch (value[0])
                    {
                        case '/':
                        {
                            value.Remove(0,1);
                            if (Convert.ToInt32(value.ToString()) != Messages.Count)
                            {
                                Error("Some message was not delivered to you.");
                                Socket.Send(Encoding.Unicode.GetBytes("|"));
                            }

                            break;
                        }
                        case '|':
                            var mes = Encoding.Unicode.GetBytes(Messages[-1].Item1 + "|"+Messages[-1].Item2);
                            Socket.SendTo(mes, _remotePoint);
                            Error("Some message was not delivered to your companion.");
                            break;
                        default:
                            string temp = "";
                            for (var i = 0; i < value.Length; i++)
                            {
                                if (value[i] != '|')
                                {
                                    temp += value[i];
                                }
                                else
                                {
                                    value.Remove(0, i + 1);
                                    Messages.Add((Convert.ToDateTime(temp), value.ToString()));
                                    DisplayMessageHistory();
                                    break;
                                }
                            }
                            break;
                    }
                }
            }
            catch(Exception ex)
            {
                Error(ex.Message);
            }
        }

        private static void SendMessage()
        {
            while (true)
            {
                var message = Console.ReadLine();
                var time = DateTime.UtcNow;
                Messages.Add((time, _nick + ": " + message));
                DisplayMessageHistory();
                var data = Encoding.Unicode.GetBytes(time + "|"+_nick + ": " + message);
                Socket.SendTo(data, _remotePoint);
                Thread.Sleep(500);
                Socket.SendTo(Encoding.Unicode.GetBytes("/" + Messages.Count),_remotePoint);
            }
        }

        private static void Error(string errorMessage)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error in messages. " + errorMessage);
            Console.ResetColor();
        }

        private static void DisplayMessageHistory()
        {
            Console.Clear();
            Messages.Sort((x,y) => x.Item1.CompareTo(y.Item1));
            foreach (var message in Messages)
            {
                Console.WriteLine(message.Item2);
            }
        }

        static void Main(string[] args)
        {
            StartPage();
            Thread receive = new (ReceiveMessages);
            receive.Start();
            Thread send = new (SendMessage);
            send.Start();
        }
    }
}