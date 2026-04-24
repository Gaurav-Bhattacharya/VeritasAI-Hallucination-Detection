// ignore: file_names
import 'package:flutter/material.dart';
import 'package:hallucination/Resultcontainer.dart';
import 'package:hallucination/provider/VerificationProvider.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
class Dashboard extends StatefulWidget{
  const Dashboard({super.key});

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  TextEditingController query=TextEditingController();
  @override
  Widget build(BuildContext context) {
    final provide=context.watch<VerificationProvider>();
    
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.black,
        appBar: PreferredSize(
          preferredSize:const Size.fromHeight(60.0) ,
          child: AppBar(
            iconTheme: IconThemeData(color: Colors.white),
            backgroundColor: const Color.fromRGBO(0, 0, 0, 1),
            leading: IconButton(onPressed: (){Navigator.pop(context);}, icon: Icon(Icons.arrow_back_ios)),
            title: TabBar(
              dividerColor: Colors.transparent,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.black,
              tabs:[
                
                Tab(child: Text("Dashboard",style: TextStyle(color: Colors.white,fontSize: 15,),),),
                Tab(child: Text("Audit Log",style: TextStyle(color: Colors.white,fontSize: 15),),)
              ]
            ),
          ),
        ),
        body: TabBarView(children: [           
            SingleChildScrollView(
              child: SizedBox(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Container(
                        padding: EdgeInsetsGeometry.directional(start: 10,top: 5,bottom: 10),
                        width: 400,
                        height: 340,
                        alignment:Alignment.centerLeft,
                        decoration: BoxDecoration(
                         color: Color(0xFF1a1a1a),
                         borderRadius: BorderRadius.circular(8)
                        ),
                        
                        child: Column(                       
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 10,),
                            Padding(
                              padding: const EdgeInsetsGeometry.directional(start:18,bottom: 10),
                              child: Text("Verify LLM Output",style: TextStyle(fontSize: 20,fontWeight: FontWeight.w500,color: Colors.white),textAlign:TextAlign.left,),
                            ),
                            Container(
                              width: double.infinity,
                              height: 200,
                                padding: EdgeInsetsGeometry.directional(start: 18,end:18),
                              child: TextField(
                                style: TextStyle(color: Colors.white),
                                controller: query,
                                maxLines: null,
                                textAlignVertical: TextAlignVertical.top,
                                expands: true,
                                decoration: InputDecoration(
                                  hintText: "Paste your LLM-generated claims here for verification...",
                                  filled: true,
                                  fillColor: Color(0xFF0f0f0f),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(5),),                                
                                ),
                              ),
                            ),
                            SizedBox(height: 20,),
                            Center(
                              child: Padding(
                                padding: const EdgeInsetsGeometry.directional(start: 18,end: 18),
                                child: SizedBox(
                                  width: double.infinity,
                                 child: ElevatedButton(onPressed: (){
                                  FocusScope.of(context).unfocus();
                                  if(!provide.isLoading){
                                    provide.verifyContent(query.text);
                                 };},
                                 style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  shape: ContinuousRectangleBorder(borderRadius: BorderRadiusGeometry.circular(10))
                                 ),
                                  child:provide.isLoading?const SizedBox(
                                    height: 20, 
                                    width: 20, 
                                    child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2)
                                    ): Text("Verify",style: TextStyle(color: Colors.black,fontWeight: FontWeight.bold),)),
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    if (provide.results.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: provide.results.length,
                        itemBuilder: (context, index) {
                          final result = provide.results[index];
                          return ResultCard(result: result);
                        },
                      ),
                    )
                  else if (!provide.isLoading)
                    const Padding(
                      padding: EdgeInsets.all(20.0),
                      child: Text("No results yet", style: TextStyle(color: Colors.white38)),
                    ),
                ],
              ),
            ),),

            SingleChildScrollView(
              child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Text("Audit Summary", style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 30),
                      SizedBox(
                        height: 250,
                        child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: [
                  PieChartSectionData(
                    value: provide.stats["Verified"],
                    title: '${provide.stats["Verified"]?.toInt()}%',
                    color:  const Color(0xFF22C55E),
                    radius: 50,
                    titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  PieChartSectionData(
                    value: provide.stats["False"],
                    title: '${provide.stats["False"]?.toInt()}%',
                    color: const Color(0xFFEF4444),
                    radius: 50,
                    titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  PieChartSectionData(
                    value: provide.stats["Unverifiable"],
                    title: '${provide.stats["Unverifiable"]?.toInt()}%',
                    color: Color(0xFFEAB308),
                    radius: 50,
                    titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
                        ),
                      ),
              
              
                    ],
                  ),
                ),
            ),
            ])));
  }
}