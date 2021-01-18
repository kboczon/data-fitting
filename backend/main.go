package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"os/exec"
	"strings"
)

type Args struct {
	Arg1 []json.Number `json:"xRow"`
	Arg2 []json.Number `json:"yRow"`
}

type ArgsWithEquation struct {
	Args
	Equation string `json:"equation"`
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	gin.SetMode(gin.DebugMode) //ReleaseMode

	router.POST("/best-fit", func(context *gin.Context) {
		var requestData Args
		body, _ := ioutil.ReadAll(context.Request.Body)
		if err := json.Unmarshal(body, &requestData); err != nil {
			panic(err)
		}

		var arg1, arg2 string
		for _, s := range requestData.Arg1 {
			arg1 += s.String() + ","
		}
		for _, s := range requestData.Arg2 {
			arg2 += s.String() + ","
		}
		arg1 = strings.TrimSuffix(arg1, ",")
		arg2 = strings.TrimSuffix(arg2, ",")

		//c := exec.Command("python", "./main.py", arg1, arg2)
		c := exec.Command("py", "./py-script/src/best-fit.py", arg1, arg2)
		stderr := &bytes.Buffer{}
		stdout := &bytes.Buffer{}
		c.Stderr = stderr
		c.Stdout = stdout
		if err := c.Run(); err != nil {
			fmt.Println("Error: ", err, "|", stderr.String())
		}

		output := stdout.String()
		context.JSON(http.StatusOK, gin.H{
			"calculationResult": output,
		}) //context.String(http.StatusOK, "Hello")
	})

	router.POST("/", func(context *gin.Context) {
		var requestData ArgsWithEquation
		body, _ := ioutil.ReadAll(context.Request.Body)
		if err := json.Unmarshal(body, &requestData); err != nil {
			panic(err)
		}

		var arg1, arg2 string
		for _, s := range requestData.Arg1 {
			arg1 += s.String() + ","
		}
		for _, s := range requestData.Arg2 {
			arg2 += s.String() + ","
		}
		arg1 = strings.TrimSuffix(arg1, ",")
		arg2 = strings.TrimSuffix(arg2, ",")

		//c := exec.Command("python", "./main.py", arg1, arg2, requestData.Equation)
		c := exec.Command("py", "./py-script/src/main.py", arg1, arg2, requestData.Equation)
		stderr := &bytes.Buffer{}
		stdout := &bytes.Buffer{}
		c.Stderr = stderr
		c.Stdout = stdout
		if err := c.Run(); err != nil {
			fmt.Println("Error: ", err, "|", stderr.String())
		}

		output := stdout.String()
		results := strings.Split(output, "Vars:")

		if len(results) == 0 || len(results) == 1 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"fitResult":    results[0],
			"fitVariables": results[1],
		})
	})

	if err := router.Run(":8000"); err != nil {
		//os.Exit(0) //should it be here?
		panic(err)
	}
}
