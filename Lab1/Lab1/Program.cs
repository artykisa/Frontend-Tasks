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
        private static readonly List<(int, string)> Messages = new();
        private static int counter;
        private const char SeparatorStick= '|';
        
    
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
                var myPort = Convert.ToInt32(Console.ReadLine());
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
                    var data = new byte[256];
                    do
                    {
                        var bytes = Socket.ReceiveFrom(data, ref _remotePoint);
                        value.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    }
                    while (Socket.Available > 0);

                    switch (value[0])
                    {
                        case SeparatorStick:
                            value.Remove(0, 1);
                            var mes = Messages[Convert.ToInt32(value)].Item1 + SeparatorStick.ToString() +Messages[Convert.ToInt32(value)].Item2;
                            var dataSend = Encoding.Unicode.GetBytes(counter + SeparatorStick.ToString() +_nick + ": " + mes);
                            Socket.SendTo(dataSend, _remotePoint);
                            Error("Some message was not delivered to your companion.");
                            break;
                        default:
                            var temp = "";
                            for (var i = 0; i < value.Length; i++)
                            {
                                if (value[i] != SeparatorStick)
                                {
                                    temp += value[i];
                                }
                                else
                                {
                                    value.Remove(0, i + 1);
                                    Messages.Add((Convert.ToInt32(temp), value.ToString()));
                                    if (counter <= Convert.ToInt32(temp))
                                    {
                                        counter = Convert.ToInt32(temp) + 1;
                                    }
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
                Messages.Add((counter, _nick + ": " + message));
                DisplayMessageHistory();
                var data = Encoding.Unicode.GetBytes(counter + SeparatorStick.ToString() +_nick + ": " + message);
                Socket.SendTo(data, _remotePoint);
                Thread.Sleep(500);
                counter++;
            }
        }
        
        private static void CheckMessages()
        {
            while (true)
            {
                Thread.Sleep(1000);
                for (var i = 0; i < Messages.Count; i++)
                {
                    if (Messages[i].Item1 == i) continue;
                    var mes = Encoding.Unicode.GetBytes(SeparatorStick.ToString() + i);
                    Socket.SendTo(mes, _remotePoint);
                    Error("Some message was not delivered to your companion.");
                }
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
            CheckMessages();
        }
    }
}