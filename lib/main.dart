import 'package:flutter/material.dart';
import 'package:hallucination/Dashboard.dart';
import 'package:hallucination/provider/VerificationProvider.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MultiProvider(providers: [
    ChangeNotifierProvider(create: (context)=>VerificationProvider())
  ],child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VeritasAI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        
        colorScheme: .fromSeed(seedColor:Colors.black),
      ),
      home: const MyHomePage(title:'VeritasAI'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  

  @override
  Widget build(BuildContext context) {
    return Scaffold(     
      body: Container(
       height: double.infinity,
       width: double.infinity,
       color: Colors.black,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("VeritasAI",style: TextStyle(
              fontSize: 50,fontWeight: FontWeight.bold,color: Colors.white
            ),
            ),
            SizedBox(height: 5,),
            Text("Verify LLM claims against trusted ",style: TextStyle(fontSize: 15,color: Color(0xFFcccccc)),),
            Text("sources.",style: TextStyle(fontSize: 15,color: Color(0xFFcccccc)),),
            SizedBox(height: 10,),
            ElevatedButton(onPressed: (){
              Navigator.push(context, MaterialPageRoute(builder:(context)=>  Dashboard()));
            }, 
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFFffffff),
              padding: EdgeInsets.all(20),
              shape: ContinuousRectangleBorder(borderRadius: BorderRadiusGeometry.circular(8))
            )
            ,child: Text("Try it now",style: TextStyle(fontWeight: FontWeight.bold,fontSize: 10),))
              
          ],
        ),
      )
    );
  }
}
